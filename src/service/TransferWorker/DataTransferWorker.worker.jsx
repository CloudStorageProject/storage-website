// DO NOT REMOVE!!!!!
/* eslint-env worker */
/* eslint-disable no-restricted-globals */
import { decryptData, encryptData, exportPrivateKeyFromPem, exportPublicKeyFromPem, processChunk } from '../../utils/Cryptography.jsx'
import { TransferAction, TransferState } from './DataTransferEnums.jsx';
import { determineFileType, determineFileFormat } from '../../utils/Structures.tsx';

if ('function' === typeof importScripts) {
    self.AES = null;
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

    async function _encryptPart(data, part) {
        var res = await processChunk(data, self.AES, part);
        self.postMessage({ state: TransferState.COMPLETE, message: { data: res, part: part } }, [res.buffer]);
    }

    async function _decryptPart(data, part) {
        var res = await processChunk(data, self.AES, part);
        self.postMessage({ state: TransferState.COMPLETE, message: { data: res, part: part } }, [res.buffer]);
    }

    function decrypt(data, key, { AES_IV, AES_KEY }) {
        const result = decryptData(data, key, { iv: AES_IV, key: AES_KEY });
        self.postMessage({ state: TransferState.COMPLETE, message: result });
    }

    self.onmessageerror = (event) => {
        self.postMessage({ state: TransferState.ERROR, message: event.error });
    }

    self.onerror = (event) => {
        console.log("Error in Worker: ", event.error);
        self.postMessage({ state: TransferState.ERROR, message: event.error });
    }

    self.onmessage = async (event) => {
        try {
            const action = event.data.action;
            switch (action) {
                case TransferAction.ENCRYPT_PART: {
                    const bytes = event.data.bytes;
                    const part = event.data.part;
                    _encryptPart(bytes, part);
                    break;
                }
                case TransferAction.DECRYPT_PART: {
                    const bytes = event.data.bytes;
                    const part = event.data.part;
                    _decryptPart(bytes, part);
                    break;
                }
                case TransferAction.UPDATE: {
                    self.AES = event.data.AES;
                    break;
                }
                case TransferAction.UPLOAD: {
                    const key = exportPublicKeyFromPem(event.data.key);
                    const folder_id = event.data.folder_id;
                    const file = event.data.file;
                    fullUpload(file, folder_id, key);
                    break;
                }
                case TransferAction.DOWNLOAD: {
                    const key = exportPrivateKeyFromPem(event.data.key);
                    decrypt(event.data.chunk, key, event.data.AES);
                    break;
                }
                default: {
                    self.postMessage({ state: TransferState.ERROR, message: "Invalid action" });
                    break;
                }
            }
        } catch (error) {
            self.onerror(error);
        }
    }
}