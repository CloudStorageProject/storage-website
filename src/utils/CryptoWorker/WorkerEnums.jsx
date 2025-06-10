const GenerationState = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETE: "COMPLETE",
    ERROR: "ERROR"
}

const GenerationType = {
    SHUTDOWN: "SHUTDOWN",
    MNEMONIC: "MNEMONIC",
    FROM_HEX: "FROM_HEX"
}

export { GenerationState, GenerationType };