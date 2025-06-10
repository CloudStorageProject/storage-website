const TransferState = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    ACCEPTED: "ACCEPTED",
    ERROR: "ERROR"
}
const TransferAction = {
    SHUTDOWN: "SHUTDOWN",
    DOWNLOAD: "DOWNLOAD",
    ENCRYPT_PART: "ENCRYPT_PART",
    DECRYPT_PART: "DECRYPT_PART",
    UPDATE: "UPDATE",
    UPLOAD: "UPLOAD"
}

const TransferType = {
    FULL: "FULL",
    PARTIAL: "PARTIAL"
}

export { TransferState, TransferType, TransferAction };