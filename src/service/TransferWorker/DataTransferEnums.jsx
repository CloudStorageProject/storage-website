const TransferState = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    ACCEPTED: "ACCEPTED",
    ERROR: "ERROR"
}
const TransferAction = {
    DOWNLOAD: "DOWNLOAD",
    UPLOAD: "UPLOAD"
}

const TransferType = {
    FULL: "FULL",
    PARTIAL: "PARTIAL"
}

export { TransferState, TransferType, TransferAction };