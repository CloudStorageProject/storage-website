import { deleteFileRequest, getFileParamsRequest, getFileRequest, renameFileRequest, uploadFileRequest } from '../api/FileRequests.jsx'

const deleteFile = async (id) => {
    try {
        if (deleteFileRequest(id)) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }
    } catch (error) {
        console.error("Error creating root folder:", error);
    }
}

const getFileFull = async (id) => {
    try {
        const file = await getFileRequest(id);
        return file;
    } catch (error) {
        console.error("Error getting file:", error);
    }
}

const getFilePart = async (id) => {
    try {
        const file = await getFileRequest(id);
        return file;
    } catch (error) {
        console.error("Error getting file:", error);
    }
}

const getFileParams = async (id) => {
    try {
        const params = await getFileParamsRequest(id);
        return params;
    } catch (error) {
        console.error("Error getting file params:", error);
    }
}

const renameFile = async (id, data) => {
    try {
        if (renameFileRequest(id, data)) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }
    } catch (error) {
        console.error("Error renaming file:", error);
    }
}

const uploadFileFull = async (data) => {
    try {
        if (uploadFileRequest(data)) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

const uploadFilePart = async (data) => {
    try {
        if (uploadFileRequest(data)) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

export { deleteFile, getFile, getFileParams, renameFile, uploadFileFull, uploadFilePart };