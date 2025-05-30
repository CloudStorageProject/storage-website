import { TransferAction } from "./DataTransferEnums";

export class WorkerForce {
    workers: Worker[] = [];
    workerStatus: boolean[] = [];
    // This works, trust me
    chunkSize = window.__ENV__.FILE_CHUNK_SIZE;
    AES: any;
    file!: File;
    buffer!: ArrayBuffer;
    fileReaderOffset = 0;
    totalParts = 0;
    part = 0;
    finishedParts = 0;
    pendingChunks: { chunk: ArrayBuffer, part: number }[] = [];
    maxWorkers = 5;
    parts_UI8: Uint8Array[] = [];
    parts_BIN: ArrayBuffer[] = [];
    _isEncrypting: boolean = false;
    _successCallback?: (result: any) => void;
    _errorCallback?: (result: string) => void;
    _progressCallback?: (result: string) => void;

    constructor(successCallback?: (result: any) => void, errorCallback?: (result: string) => void, progressCallback?: (result: string) => void) {
        try {
            this._successCallback = successCallback;
            this._errorCallback = errorCallback;
            this._progressCallback = progressCallback;
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, 0);
        }
    }

    async encrypt(file: File, AES: any,) {
        try {
            this.AES = AES;
            this.file = file;
            this._isEncrypting = true;
            this.totalParts = Math.ceil(file.size / this.chunkSize)
            this.parts_UI8 = new Array(this.totalParts);
            const workerCount = Math.min(this.maxWorkers, this.totalParts);

            // Create worker pool
            for (let i = 0; i < workerCount; i++) {
                const worker = new Worker(new URL('./DataTransferWorker.worker.jsx', import.meta.url));
                worker.postMessage({ action: TransferAction.UPDATE, AES: this.AES });
                worker.onmessage = (event) => this.onWorkerDone(event, i);
                worker.onerror = (event) => this.onWorkerError(event, i);
                this.workers.push(worker);
                this.workerStatus[i] = false;
            }
            // Start reading and dispatching
            this.readNextChunk();
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, 0);
        }
    }

    async decrypt(array: ArrayBuffer, AES: any,) {
        try {
            if (array.byteLength === 0) throw Error("File is empty");
            this.AES = AES;
            this.buffer = array;
            this._isEncrypting = false;
            this.totalParts = Math.ceil(array.byteLength / this.chunkSize)
            // console.log(this.totalParts);

            this.parts_BIN = new Array(this.totalParts);
            const workerCount = Math.min(this.maxWorkers, this.totalParts);

            // Create worker pool
            for (let i = 0; i < workerCount; i++) {
                const worker = new Worker(new URL('./DataTransferWorker.worker.jsx', import.meta.url));
                worker.postMessage({ action: TransferAction.UPDATE, AES: this.AES });
                worker.onmessage = (event) => this.onWorkerDone(event, i);
                worker.onerror = (event) => this.onWorkerError(event, i);
                this.workers.push(worker);
                this.workerStatus[i] = false;
            }

            // Start reading and dispatching
            this.readNextChunk();
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, 0);
        }
    }

    readNextChunk() {
        try {
            if (this._isEncrypting) {
                if ((this.fileReaderOffset >= this.file.size) || this.workerStatus.every(busy => busy)) return;
                // console.log("Reading: ", this.fileReaderOffset, this.file.size, Math.round((this.fileReaderOffset / this.file.size) * 100), "%");
                this._progressCallback?.(Math.round((this.fileReaderOffset / this.file.size) * 100) + "%");
                const blob = this.file.slice(this.fileReaderOffset, Math.min((this.fileReaderOffset + this.chunkSize), this.file.size));
                const reader = new FileReader();
                reader.onload = (evt: any) => {
                    const chunk = evt.target.result as ArrayBuffer;
                    const partNum = this.part++;
                    const offset = chunk.byteLength;
                    // console.log("Read part: ", offset);
                    this.dispatchToAvailableWorker(chunk, partNum);
                    this.fileReaderOffset += offset;
                    if (this.workerStatus.some(busy => !busy)) {
                        this.readNextChunk();
                    }
                };
                reader.readAsArrayBuffer(blob);
            } else {
                if ((this.fileReaderOffset >= this.buffer.byteLength) || (this.workerStatus.every(busy => busy))) return;
                this._progressCallback?.(Math.round((this.fileReaderOffset / this.buffer.byteLength) * 100) + "%");
                const blob = this.buffer.slice(this.fileReaderOffset, Math.min((this.fileReaderOffset + this.chunkSize), this.buffer.byteLength));
                const partNum = this.part++;
                const offset = blob.byteLength;
                // console.log("Read part: ", offset);
                this.dispatchToAvailableWorker(blob, partNum);
                this.fileReaderOffset += offset;
                if (this.workerStatus.some(busy => !busy)) {
                    this.readNextChunk();
                }
            }
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, 0);
        }
    }

    onWorkerError(event: ErrorEvent, workerId: number) {
        try {
            console.error(event.message);
            this.workerStatus[workerId] = false;
            this.workers[workerId].terminate();
            this._errorCallback?.(event.message);
        } catch (error) {
            this._errorCallback?.(event.message);
        }
    }

    dispatchToAvailableWorker(chunk: ArrayBuffer, part: number) {
        try {
            const index = this.workerStatus.findIndex(busy => !busy);
            if (index === -1) {
                this.pendingChunks.push({ chunk, part });
                return;
            }

            this.workerStatus[index] = true;
            this.workers[index].postMessage({
                action: this._isEncrypting ? TransferAction.ENCRYPT_PART : TransferAction.DECRYPT_PART,
                bytes: chunk,
                AES: this.AES,
                part
            }, [chunk]);
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, part);
        }
    }

    onWorkerDone(event: MessageEvent, workerId: number) {
        try {
            this.finishedParts++;
            // console.log("Worker ", workerId, " finished part ", event.data.message.part, " of ", this.totalParts, " data: " + event.data.message.data.length);
            // console.log("Last 10 bytes: ", event.data.message.data.slice(-10));
            if (this._isEncrypting) {
                this.parts_UI8[event.data.message.part] = event.data.message.data;
            } else {
                this.parts_BIN[event.data.message.part] = event.data.message.data.buffer;
            }
            this.workerStatus[workerId] = false;
            if ('memory' in performance) {
                // @ts-ignore
                // console.log(`JS heap used: ` + (performance.memory.usedJSHeapSize / 1024 / 1024) + ` MB`);
            }
            // Save or forward encrypted data here...

            if (this.finishedParts === this.totalParts) {
                // Terminate all workers
                this.workers.forEach(worker => worker.terminate());
                if (this._isEncrypting) {
                    const blob = new Blob(this.parts_UI8, { type: 'application/octet-stream' });
                    // console.log(`Final Blob size: ${blob.size / 1024 / 1024} MB`);
                    this._successCallback?.(blob);
                } else {
                    // console.log("Decrypted last 10 bytes: ", this.parts_BIN[this.parts_BIN.length - 1].slice(-10));
                    const finalArray = new Uint8Array(this.parts_BIN.reduce((acc, curr) => acc + curr.byteLength, 0));
                    let offset = 0;
                    this.parts_BIN.forEach(buffer => {
                        finalArray.set(new Uint8Array(buffer), offset);
                        offset += buffer.byteLength;
                    });
                    this._successCallback?.(finalArray);
                }
            }

            // Dispatch any queued chunk
            if (this.pendingChunks.length > 0) {
                const { chunk, part } = this.pendingChunks.shift()!;
                this.dispatchToAvailableWorker(chunk, part);
            }

            // Trigger more reading if any file left
            this.readNextChunk();
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, workerId);
        }
    }
}
