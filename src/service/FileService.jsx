import { deleteFileRequest, getFileParamsRequest, getFileRequest, renameFileRequest, uploadFileRequest } from '../api/FileRequests.jsx'
import { getFolderRequest } from '../api/FolderRequests.jsx';
import { NotificationType } from '../hooks/Notification/NotificationTypes.tsx';
import { DecryptAES, EncryptAES, generateAESData } from '../utils/Cryptography.jsx';
import { determineFileFormat, determineFileType } from '../utils/Structures.tsx';
import { WorkerForce } from './TransferWorker/WorkerForce.tsx';

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


const performDownload = async (file, privateKey, fileProperties, notify) => {
    const downloadFileInChunks = async (file, fileProperties, privateKey) => {
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
                await new Promise((resolve, reject) => {
                    const onSuccess = async (result) => {
                        controller.enqueue(result);
                        resolve();
                    }
                    const onError = (error) => {
                        notify.postNotification("File encryption failed", NotificationType.FILE_ENCRYPTION_FAILURE);
                        reject(error);
                    }
                    const onProgress = (progress) => {
                        // console.log("Progress: " + progress);
                    }
                    const illness = new WorkerForce(onSuccess, onError, onProgress);
                    notify.postNotification("Decrypting file", NotificationType.FILE_DECRYPTION);
                    const AES = DecryptAES({ iv: fileProperties.data.encrypted_iv, key: fileProperties.data.encrypted_key }, privateKey);
                    illness.decrypt(chunk, AES);
                });
            },
        });
        const writer = transformStream.writable.getWriter();
        const reader = transformStream.readable.getReader();
        var downloadChunk = null;
        downloadChunk = async () => {
            notify.postNotification("Downloading file", NotificationType.FILE_DOWNLOAD);
            const response = (await getFileFull(file.file_id));
            if (response === undefined || response === null || response.error !== null) {
                notify.postNotification("File download failed", NotificationType.FILE_DOWNLOAD_FAILURE);
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                await writer.write(response.data);
            }
            writer.close();
        };
        downloadChunk().catch((e) => {
            console.error(e);
            notify.postNotification("File download failed", NotificationType.FILE_DOWNLOAD_FAILURE);
        });
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            await writableStream.write(value);
        }
        await writableStream.close();
        notify.postNotification("File downloaded", NotificationType.FILE_DOWNLOAD_SUCCESS);
    };
    downloadFileInChunks(file, fileProperties, privateKey).catch(console.error);
}



const uploadFile = async (file, page, auth, notify, folder_id) => {
    return new Promise((resolve, reject) => {
        getFolderRequest(page.pageState.currentFolder.id).then(async (response) => {
            const { data, error } = response;
            if (error) {
                console.error(error);
            }
            for (let i = 0; i < data.files.length; i++) {//Check if file with this name already exists
                const f = data.files[i];
                if (f.name === file.name) {
                    notify.postNotification("File already exists", NotificationType.FILE_UPLOAD_FAILURE);
                    return;
                }
            }


            const AES = generateAESData();
            const AES_DATA = EncryptAES(AES, auth.keyPair.publicKey);
            const prepared = {
                "folder_id": folder_id,
                "name": file.name,
                "type": determineFileType(file),
                "format": determineFileFormat(file),
                "encrypted_key": AES_DATA.key,
                "encrypted_iv": AES_DATA.iv
            }

            const onSuccess = async (result) => {
                // We roll with XMLHttpRequest because fuck it we ball.
                notify.postNotification("Uploading file", NotificationType.FILE_UPLOAD);
                const formData = new FormData();
                formData.append('metadata', JSON.stringify(prepared));
                formData.append('upload', result);
                const xhr = new XMLHttpRequest();
                xhr.open('POST', window.__ENV__.REACT_APP_API_URL + 'files/');
                xhr.setRequestHeader('Authorization', `Bearer ${auth.token}`);
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        // const percent = ((event.loaded / event.total) * 100).toFixed(2);
                        // console.log(`Upload progress: ${percent}%`);
                    }
                };
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        notify.postNotification("File uploaded", NotificationType.FILE_UPLOAD_SUCCESS);
                        resolve(xhr.response);
                    } else {
                        notify.postNotification("File upload failed", NotificationType.FILE_UPLOAD_FAILURE);
                        reject(xhr.response);
                    }
                };
                xhr.onerror = () => {
                    notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
                };
                xhr.send(formData);
            }

            const onError = (error) => {
                notify.postNotification("File encryption failed", NotificationType.FILE_ENCRYPTION_FAILURE);
                reject(error);
            }
            const onProgress = (progress) => {
                // console.log("Progress: " + progress);
            }
            const illness = new WorkerForce(onSuccess, onError, onProgress);

            // BUG: This shit will break if user does not have enough RAM
            // if (file.size > 370 * 1024 * 1024) {
            //     notify.postNotification("Max File Size: 375MB", NotificationType.FILE_UPLOAD_FAILURE);
            // } else {
            notify.postNotification("Encrypting file", NotificationType.FILE_ENCRYPTION);
            illness.encrypt(file, AES);
            // }
        }).catch((error) => {
            console.error(error);
        });

    });
}

const downloadFile = async (file, privateKey, notify, folder_id) => {
    getFileParams(file.file_id).then((response) => {
        performDownload(file, privateKey, response, notify, folder_id);
    });
}

export {
    DataTransferWorker, uploadFile, downloadFile, deleteFile, getFileParams, renameFile, getFileFull
};
