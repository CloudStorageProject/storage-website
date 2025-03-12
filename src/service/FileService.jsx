import { deleteFileRequest, getFileParamsRequest, getFileRequest, renameFileRequest, uploadFileRequest } from '../api/FileRequests.jsx'
import { decryptData } from '../utils/Cryptography.jsx';

const DataTransferWorker = new Worker(new URL('./TransferWorker/DataTransferWorker.worker.jsx', import.meta.url), { name: "DataTransfer" });

const deleteFile = async (id) => {
    deleteFileRequest(id).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

const getFileFull = async (id) => {
    getFileRequest(id).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

const getFilePart = async (id, start, end) => {
    getFileRequest({ id: id, start: start, end: end }).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

const getFileParams = async (id) => {
    getFileParamsRequest(id).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

const renameFile = async (id, data) => {
    renameFileRequest(id, data).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

const uploadFileFull = async (data) => {
    uploadFileRequest(data).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

const uploadFilePart = async (data) => {
    uploadFileRequest(data).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

const performDownload = async (file, privateKey) => {
    const createTransformStream = () =>
        new TransformStream({
            async transform(chunk, controller) {
                // TODO: Confirm if the file accepted from backend contains encrypted AES data
                // const decryptedChunk = decryptData(chunk, privateKey);
                // const decryptedChunk = decryptData(chunk, privateKey, await getFileParams(file.id));
                const processedChunk = chunk;
                controller.enqueue(processedChunk);
            },
        });

    const downloadFileInChunks = async (size, chunkSize, waitTime) => {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: "downloaded_file.txt",
            types: [
                {
                    description: "Binary File",
                    accept: {
                        "application/octet-stream": [".txt"],
                    },
                },
            ],
        });

        const writableStream = await fileHandle.createWritable();
        const transformStream = createTransformStream();
        const writer = transformStream.writable.getWriter();
        const reader = transformStream.readable.getReader();
        const downloadChunk = null;
        if (file.size < 1024 * 1024 * 10) {
            downloadChunk = async () => {
                const chunk = await getFileFull(file.id);
                if (chunk === undefined) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    await writer.write(chunk);
                }
                writer.close();
            };
        } else {
            let start = 0;
            downloadChunk = async () => {
                while (start < size) {
                    const end = Math.min(start + chunkSize - 1, size - 1);
                    const chunk = await getFilePart(file.id, start, end);
                    if (chunk === undefined) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        await writer.write(chunk);
                        start = end + 1;
                    }
                }
                writer.close();
            };
        }
        downloadChunk().catch(console.error);
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            await writableStream.write(value);
        }
        await writableStream.close();
    };
    const chunkSize = 10 * 1024 * 1024; // 10 MB chunk size
    const fileSize = file.size; // 5 GB file size
    downloadFileInChunks(fileSize, chunkSize).catch(console.error);
}


export {
    DataTransferWorker, performDownload, deleteFile, getFileParams, renameFile, uploadFileFull, uploadFilePart, getFileFull, getFilePart
};