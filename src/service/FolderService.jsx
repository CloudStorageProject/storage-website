import { createFolderRequest, createRootFolderRequest, deleteFolderRequest, getFolderRequest, getFoldersRequest, renameFolderRequest } from '../api/FolderRequests';

const renameFolder = async (id, data) => {
    try {
        if (renameFolderRequest(id, data)) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }

    } catch (error) {
        console.error("Error renaming folder:", error);
    }
}

const deleteFolder = async (id) => {
    try {
        if (deleteFolderRequest(id)) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
    }
}

const createFolder = async (data) => {
    try {
        if (createFolderRequest(data)) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }
    } catch (error) {
        console.error("Error creating folder:", error);
    }
}

const createRootFolder = async () => {
    try {
        if (createRootFolderRequest()) {
            // TODO: show success message
        } else {
            // TODO: show error message
        }
    } catch (error) {
        console.error("Error creating root folder:", error);
    }
}

const getFolder = async (id) => {
    try {
        const folder = await getFolderRequest(id);
        return folder;
    } catch (error) {
        console.error("Error getting folder:", error);
    }
}

const getFolders = async () => {
    try {
        const folders = await getFoldersRequest();
        return folders;
    } catch (error) {
        console.error("Error getting folders:", error);
    }
}

export default { renameFolder, deleteFolder, createFolder, createRootFolder, getFolder, getFolders, };