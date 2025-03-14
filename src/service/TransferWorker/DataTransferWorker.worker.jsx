// DO NOT REMOVE!!!!!
/* eslint-env worker */
/* eslint-disable no-restricted-globals */
import { decryptData, encryptData, exportPrivateKeyFromPem, exportPublicKeyFromPem } from '../../utils/Cryptography.jsx'
import { TransferAction, TransferState } from './DataTransferEnums.jsx';
import { determineFileType, determineFileFormat } from '../../utils/Structures.tsx';

if ('function' === typeof importScripts) {
    const padding = 1024 * 1024 * 1; // 1 MB

    function fullUpload(file, folder_id, key) {
        const fileReader = new FileReader();

        fileReader.onload = async function () {
            const bytes = new Uint8Array(this.result);
            const encrypted = encryptData(bytes, key);
            const prepared_to_send = {
                "folder_id": folder_id,
                "name": file.name,
                "type": determineFileType(file),
                "format": determineFileFormat(file),
                "encrypted_key": encrypted.key,
                "encrypted_iv": encrypted.iv,
                "content": encrypted.data
            }
            //  https://github.com/axios/axios/issues/70
            self.postMessage({ state: TransferState.COMPLETE, message: prepared_to_send });
        };
        fileReader.readAsArrayBuffer(file);
    }

    function partialUpload(file, folder_id, key) {
        let offset = 0;
        while (offset < file.size) {
            const chunk = file.slice(offset, offset + padding);
            const chunkReader = new FileReader();
            chunkReader.onload = function () {
                const bytes = new Uint8Array(this.result);
                const encrypted = encryptData(bytes, key);
                const prepared_to_send = {
                    "folder_id": folder_id,
                    "name": file.name,
                    "type": determineFileType(file),
                    "format": determineFileFormat(file),
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

    function decrypt(data, key, { AES_IV, AES_KEY }) {
        self.postMessage({ state: TransferState.ACCEPTED, message: "Processing" });
        const result = decryptData(data, key, { iv: AES_IV, key: AES_KEY });
        self.postMessage({ state: TransferState.COMPLETE, message: result });
    }

    self.onmessageerror = (event) => {
        self.postMessage({ state: TransferState.ERROR, message: event.error });
    }

    self.onerror = (event) => {
        self.postMessage({ state: TransferState.ERROR, message: event.error });
    }

    self.onmessage = async (event) => {
        const action = event.data.action;
        const file = event.data.file;

        self.postMessage({ state: TransferState.ACCEPTED, message: "Processing" });
        if (action === TransferAction.UPLOAD) {
            const key = exportPublicKeyFromPem(event.data.key);
            const folder_id = event.data.folder_id;
            fullUpload(file, folder_id, key);
            // if (file.size > padding) {
            //     console.log(`${file.name} is bigger than ${padding} bytes. [${file.size}]`);
            //     // TODO: Implement partial upload
            //     partialUpload(file, folder_id, key);
            // } else {
            //     console.log(`${file.name} is smaller than ${padding} bytes. [${file.size}]`);
            //     fullUpload(file, folder_id, key);
            // }
        } else if (action === TransferAction.DOWNLOAD) {
            const key = exportPrivateKeyFromPem(event.data.key);
            decrypt(event.data.chunk, key, event.data.AES);
        }
    }
}