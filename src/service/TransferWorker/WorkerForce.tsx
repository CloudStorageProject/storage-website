import { TransferAction } from "./DataTransferEnums";

export class WorkerForce {
    workers: Worker[] = [];
    workerStatus: boolean[] = [];
    // This works, trust me
    chunkSize = window.__ENV__.FILE_CHUNK_SIZE;
    AES: any;
    // file!: File;
    // buffer!: ArrayBuffer;
    fileReaderOffset = 0;
    totalParts = 0;
    part = 0;
    finishedParts = 0;
    pendingChunks: { chunk: ArrayBuffer, part: number }[] = [];
    maxWorkers = 5;
    parts_BIN: ArrayBuffer[] = [];
    _isEncrypting: boolean = false;
    _successCallback?: (result: any) => void;
    _errorCallback?: (result: string) => void;
    _progressCallback?: (result: string) => void;

    detectMob() {
        return ((window.innerWidth <= 800) && (window.innerHeight <= 600));
    }

    constructor(successCallback?: (result: any) => void, errorCallback?: (result: string) => void, progressCallback?: (result: string) => void) {
        try {
            if (typeof this.chunkSize !== "number" || this.chunkSize === undefined || this.chunkSize === null || this.chunkSize <= 0) {// Safeguard for chunkSize
                this.chunkSize = 10 * 1024 * 1024
            }
            this._successCallback = successCallback;
            this._errorCallback = errorCallback;
            this._progressCallback = progressCallback;
            if (this.detectMob()) {
                this.maxWorkers = 1
            }
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, 0);
        }
    }

    async encrypt(file: File | null, AES: any,) {

        try {
            if (file === null) throw Error("File is empty");
            this.AES = AES;
            // this.file = file;
            this._isEncrypting = true;
            this.totalParts = Math.ceil(file.size / this.chunkSize)
            this.parts_BIN = new Array(this.totalParts);
            const workerCount = Math.min(this.maxWorkers, this.totalParts);

            for (let i = 0; i < workerCount; i++) {
                const worker = new Worker(new URL("./DataTransferWorker.worker.jsx", import.meta.url));
                worker.postMessage({ action: TransferAction.UPDATE, AES: this.AES });
                worker.onmessage = (event) => this.onWorkerDone(event, i);
                worker.onerror = (event) => this.onWorkerError(event, i);
                this.workers.push(worker);
                this.workerStatus[i] = false;
            }
            const blob = file.slice(this.fileReaderOffset, Math.min((this.fileReaderOffset + this.chunkSize), file.size));
            const reader = new FileReader();
            reader.onload = (evt: any) => {
                if (file === null) throw Error("File is empty");
                const chunk = evt.target.result as ArrayBuffer;
                const partNum = this.part++;
                const offset = chunk.byteLength;
                this._progressCallback?.("Reading: " + this.fileReaderOffset + " of " + file.size + " - " + Math.round((this.fileReaderOffset / file.size) * 100) + "%");
                this.dispatchToAvailableWorker(chunk, partNum);
                this.fileReaderOffset += offset;
                if (this.fileReaderOffset < file.size) {
                    this._progressCallback?.(Math.round((this.fileReaderOffset / file.size) * 100) + "%");
                    const blob = file.slice(this.fileReaderOffset, Math.min((this.fileReaderOffset + this.chunkSize), file.size));
                    reader.readAsArrayBuffer(blob);
                }
            }
            reader.readAsArrayBuffer(blob);
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, 0);
        }
    }

    async decrypt(buffer: ArrayBuffer, AES: any,) {
        try {
            if (buffer.byteLength === 0) throw Error("File is empty");
            this.AES = AES;
            this._isEncrypting = false;
            this.totalParts = Math.ceil(buffer.byteLength / this.chunkSize)
            this.parts_BIN = new Array(this.totalParts);
            const workerCount = Math.min(this.maxWorkers, this.totalParts);
            // Create worker pool
            for (let i = 0; i < workerCount; i++) {
                const worker = new Worker(new URL("./DataTransferWorker.worker.jsx", import.meta.url));
                worker.postMessage({ action: TransferAction.UPDATE, AES: this.AES });
                worker.onmessage = (event) => this.onWorkerDone(event, i);
                worker.onerror = (event) => this.onWorkerError(event, i);
                this.workers.push(worker);
                this.workerStatus[i] = false;
            }

            while (this.fileReaderOffset < buffer.byteLength) {
                this._progressCallback?.("Reading: " + this.fileReaderOffset + " of " + buffer.byteLength + " - " + Math.round((this.fileReaderOffset / buffer.byteLength) * 100) + "%");
                const blob = buffer.slice(this.fileReaderOffset, Math.min((this.fileReaderOffset + this.chunkSize), buffer.byteLength));
                const partNum = this.part++;
                const offset = blob.byteLength;
                this.dispatchToAvailableWorker(blob, partNum);
                this.fileReaderOffset += offset;
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
            this._progressCallback?.("Worker " + workerId + " finished part " + (event.data.message.part + 1) + " of " + this.totalParts + " data: " + event.data.message.data.length);

            this.parts_BIN[event.data.message.part] = event.data.message.data;
            this.workerStatus[workerId] = false;
            // if ('memory' in performance) {
            // @ts-ignore
            //     console.log(`JS heap used: ` + (performance.memory.usedJSHeapSize / 1024 / 1024) + ` MB`);
            // }


            if (this.finishedParts === this.totalParts) {
                // Terminate all workers
                if (this._isEncrypting) {
                    const blob = new Blob(this.parts_BIN, { type: 'application/octet-stream' });
                    this._successCallback?.(blob);
                } else {
                    const finalArray = new Uint8Array(this.parts_BIN.reduce((acc, curr) => acc + curr.byteLength, 0));
                    let offset = 0;
                    this.parts_BIN.forEach(buffer => {
                        finalArray.set(new Uint8Array(buffer), offset);
                        offset += buffer.byteLength;
                    });
                    this._successCallback?.(finalArray);
                }
                // this.workers.forEach(worker => worker.terminate());
            } else if (this.pendingChunks.length > 0) { // Dispatch any queued chunk
                let { chunk, part } = this.pendingChunks.shift()!;
                this.dispatchToAvailableWorker(chunk, part);
            }
        } catch (error) {
            this.onWorkerError(error as ErrorEvent, workerId);
        }
    }
}
