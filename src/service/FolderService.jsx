import { createFolderRequest, createRootFolderRequest, deleteFolderRequest, getFolderRequest, getFoldersRequest, renameFolderRequest } from '../api/FolderRequests';

export const renameFolder = async (id, data) => {
    renameFolderRequest(id, data).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

export const deleteFolder = async (id) => {
    deleteFolderRequest(id).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

export const createFolder = async (data) => {
    createFolderRequest(data).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

/**
 * Creates folder in root folder
 * 
 * @param {string} name
 * @returns `[data, error]` or `[null, error]`
 * 
 */
export const createRootFolder = async (name) => {
    createRootFolderRequest(name).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

export const getFolder = async (id) => {
    getFolderRequest(id).then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

/**
 * Returns files and folders from root folder
 * 
 * @returns ` { response: response.data, error: null }` or `[null, error]`
 */
export const getFolders = async () => {
    getFoldersRequest().then((response) => {
        return { response: response.data, error: null };
    }).catch((error) => {
        return { response: null, error: error };
    });
}

// export default { renameFolder, deleteFolder, createFolder, createRootFolder, getFolder, getFolders, };