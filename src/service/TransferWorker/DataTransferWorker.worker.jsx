// DO NOT REMOVE!!!!!
/* eslint-env worker */
/* eslint-disable no-restricted-globals */
import { encryptData, exportPublicKeyFromPem } from '../../utils/Cryptography.jsx'
import { TransferAction, TransferState } from './DataTransferEnums.jsx';
import { deleteFileRequest, getFileParamsRequest, getFileRequest, renameFileRequest, uploadFileRequest } from '../../api/FileRequests.jsx'

if ('function' === typeof importScripts) {
    const fileReader = new FileReader();
    // For 2048 byte key = 245
    const padding = 1024 * 1024 * 10; // 10 MB

    function fullUpload(file, key) {
        fileReader.onload = async function () {
            const bytes = new Uint8Array(this.result);
            const encrypted = encryptData(bytes, key);
            const prepared_to_send = {
                "folder_id": 0,
                "name": file.name,
                "type": "FUCK IF I KNOW",
                "format": "FUCK IF I KNOW",
                "encrypted_key": encrypted.key,
                "encrypted_iv": encrypted.iv,
                "content": encrypted.data
            }
            //  https://github.com/axios/axios/issues/70
            self.postMessage({ state: TransferState.COMPLETE, message: prepared_to_send });
            self.close();
        };
        fileReader.readAsArrayBuffer(file);
    }

    function partialUpload(file, key) {
        let offset = 0;
        while (offset < file.size) {
            const chunk = file.slice(offset, offset + padding);
            const chunkReader = new FileReader();
            chunkReader.onload = function () {
                const bytes = new Uint8Array(this.result);
                const encrypted = encryptData(bytes, key);
                const prepared_to_send = {
                    "folder_id": 0,
                    "name": file.name,
                    "type": "FUCK IF I KNOW",
                    "format": "FUCK IF I KNOW",
                    "encrypted_key": encrypted.key,
                    "encrypted_iv": encrypted.iv,
                    "content": encrypted.data
                }
                //  https://github.com/axios/axios/issues/70
                self.postMessage({ state: TransferState.PARTIAL, message: prepared_to_send });
            };
            chunkReader.readAsArrayBuffer(chunk);
            offset += padding;
            self.postMessage({ state: TransferState.IN_PROGRESS, message: offset });
        }
    }

    self.onmessageerror = (event) => {
        self.postMessage({ state: TransferState.ERROR, message: event.error });
        self.close();
    }

    self.onerror = (event) => {
        self.postMessage({ state: TransferState.ERROR, message: event.error });
        self.close();
    }

    self.onmessage = async (event) => {
        const action = event.data.action;
        const file = event.data.file;
        const key = exportPublicKeyFromPem(event.data.key);

        self.postMessage({ state: TransferState.ACCEPTED, message: "Processing" });
        if (action === TransferAction.UPLOAD) {
            if (file.size > padding) {
                console.log(`${file.name} is bigger than ${padding} bytes. [${file.size}]`);
                // TODO: Implement partial upload
                partialUpload(file, key);
            } else {
                console.log(`${file.name} is smaller than ${padding} bytes. [${file.size}]`);
                fullUpload(file, key);
            }
        }
    }
}