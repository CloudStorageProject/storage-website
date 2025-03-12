import { deleteFileRequest, getFileParamsRequest, getFileRequest, renameFileRequest, uploadFileRequest } from '../api/FileRequests.jsx'
import { NotificationType } from '../hooks/Notification/NotificationTypes.tsx';
import { exportPrivateKeyToBase64, exportPublicKeyToBase64 } from '../utils/Cryptography.jsx';
import { TransferAction, TransferState } from './TransferWorker/DataTransferEnums.jsx';

const DataTransferWorker = new Worker(new URL('./TransferWorker/DataTransferWorker.worker.jsx', import.meta.url), { name: "DataTransfer" });

const deleteFile = async (id) => {
    return await deleteFileRequest(id).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

const getFileFull = async (id) => {
    return await getFileRequest(id).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

const getFilePart = async (id, start, end) => {
    return await getFileRequest({ id: id, start: start, end: end }).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

const getFileParams = async (id) => {
    return await getFileParamsRequest(id).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

const renameFile = async (id, data) => {
    return await renameFileRequest(id, data).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

const uploadFileFull = async (data) => {
    return await uploadFileRequest(data).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

const uploadFilePart = async (data) => {
    return await uploadFileRequest(data).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

const performDownload = async (file, privateKey, fileProperties, notify) => {
    const downloadFileInChunks = async (chunkSize, file, fileProperties, privateKey) => {
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileProperties.data.name,
            types: [
                {
                    description: "Binary File",
                    accept: {
                        "application/octet-stream": ["." + fileProperties.data.format],
                    },
                },
            ],
        });

        const writableStream = await fileHandle.createWritable();
        const transformStream = new TransformStream({
            async transform(chunk, controller) {
                const decryption = new Promise((resolve, reject) => {
                    DataTransferWorker.postMessage({ action: TransferAction.DOWNLOAD, chunk: chunk, key: exportPrivateKeyToBase64(privateKey), AES: { AES_IV: fileProperties.data.encrypted_iv, AES_KEY: fileProperties.data.encrypted_key } });
                    notify.postNotification("Decrypting file", NotificationType.FILE_DECRYPTION);
                    notify.postNotification("Decrypting file", NotificationType.FILE_DECRYPTION);
                    DataTransferWorker.onmessage = (event) => {
                        if (event.data.state === TransferState.COMPLETE || event.data.state === TransferState.PARTIAL) {
                            resolve(event.data.message);
                        } else if (event.data.state === TransferState.ACCEPTED || event.data.state === TransferState.IN_PROGRESS) {
                            // TODO: Implement Partial progress
                        } else {
                            notify.postNotification("File decryption failed", NotificationType.FILE_DECRYPTION_FAILURE);
                            notify.postNotification("File decryption failed", NotificationType.FILE_DECRYPTION_FAILURE);
                            reject(event.data.message);
                        }
                    };
                });
                controller.enqueue(await decryption);
            },
        });
        const writer = transformStream.writable.getWriter();
        const reader = transformStream.readable.getReader();
        var downloadChunk = null;
        if (true) { // if (file.size < 1024 * 1024 * 10) {//Full file download
            downloadChunk = async () => {
                notify.postNotification("Downloading file", NotificationType.FILE_DOWNLOAD);
                const chunk = await getFileFull(file.file_id);
                const base64String = chunk.data.toString('base64');
                if (chunk === undefined) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    await writer.write(base64String);
                }
                writer.close();
            };
        } else { // chunk file download
            // let start = 0;
            // downloadChunk = async () => {
            //     while (start < size) {
            //         const end = Math.min(start + chunkSize - 1, size - 1);
            //         const chunk = await getFilePart(file.file_id, start, end);
            //         const base64String = chunk.data.toString('base64');
            //         if (base64String === undefined) {
            //             await new Promise(resolve => setTimeout(resolve, 2000));
            //         } else {
            //             await writer.write(base64String);
            //             start = end + 1;
            //         }
            //     }
            //     writer.close();
            // };
        }
        downloadChunk().catch(console.error);
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            await writableStream.write(value);
        }
        await writableStream.close();
        notify.postNotification("File downloaded", NotificationType.FILE_DOWNLOAD_SUCCESS);
        notify.postNotification("File downloaded", NotificationType.FILE_DOWNLOAD_SUCCESS);
    };
    const chunkSize = 1 * 1024 * 1024; // 1 MB chunk size
    downloadFileInChunks(chunkSize, file, fileProperties, privateKey, DataTransferWorker).catch(console.error);
}

const uploadFile = async (file, page, auth, notify) => {
    const uploadFile = async (file, page, auth, notify) => {
        return new Promise((resolve, reject) => {
            DataTransferWorker.postMessage({ action: TransferAction.UPLOAD, file: file, folder_id: page.pageState.currentFolder.id, key: exportPublicKeyToBase64(auth.keyPair.publicKey) });
            notify.postNotification("Encrypting file...", NotificationType.FILE_ENCRYPTION)
            notify.postNotification("Encrypting file...", NotificationType.FILE_ENCRYPTION)
            DataTransferWorker.onmessage = async (event) => {
                if (event.data.state === TransferState.COMPLETE || event.data.state === TransferState.PARTIAL) {
                    notify.postNotification("Uploading file...", NotificationType.FILE_UPLOAD);
                    notify.postNotification("Uploading file...", NotificationType.FILE_UPLOAD);
                    const { data, error } = await uploadFileFull(event.data.message);
                    if (error) {
                        notify.postNotification("File encryption failed", NotificationType.FILE_ENCRYPTION_FAILURE);
                        notify.postNotification("File encryption failed", NotificationType.FILE_ENCRYPTION_FAILURE);
                        reject(error);
                    }
                    notify.postNotification("File uploaded", NotificationType.FILE_UPLOAD_SUCCESS);
                    notify.postNotification("File uploaded", NotificationType.FILE_UPLOAD_SUCCESS);
                    resolve(data);
                } else if (event.data.state === TransferState.ACCEPTED || event.data.state === TransferState.IN_PROGRESS) {
                    // TODO: Implement Partial progress
                } else {
                    notify.postNotification("File upload failed", NotificationType.FILE_UPLOAD_FAILURE);
                    notify.postNotification("File upload failed", NotificationType.FILE_UPLOAD_FAILURE);
                    reject(event.data.message);
                }
            };
        });
    }

    const downloadFile = async (file, privateKey, notify) => {
        const downloadFile = async (file, privateKey, notify) => {
            getFileParams(file.file_id).then((response) => {
                performDownload(file, privateKey, response, notify);
                performDownload(file, privateKey, response, notify);
            });
        }
    }
}
export {
    DataTransferWorker, uploadFile, downloadFile, deleteFile, getFileParams, renameFile, getFileFull, getFilePart
};