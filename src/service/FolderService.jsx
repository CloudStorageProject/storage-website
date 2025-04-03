import { createFolderRequest, createRootFolderRequest, deleteFolderRequest, getAvailableUserSpace, getFolderRequest, getFoldersRequest, renameFolderRequest } from '../api/FolderRequests';

export const renameFolder = async (id, data) => {
    return await renameFolderRequest(id, data).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

export const deleteFolder = async (id) => {
    return await deleteFolderRequest(id).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

export const createFolder = async (data) => {
    return await createFolderRequest({ id: data.id, name: data.name }).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
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
    return await createRootFolderRequest(name).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

export const getFolder = async (id) => {
    return await getFolderRequest(id).then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

/**
 * Returns files and folders from root folder
 * 
 * @returns ` { response: response.data, error: null }` or `[null, error]`
 */
export const getRootFolder = async () => {
    return await getFoldersRequest().then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

export const getAvailableSpace = async () => {
    return await getAvailableUserSpace().then((response) => {
        return { data: response.data, error: null };
    }).catch((error) => {
        return { data: null, error: error };
    });
}

// export default { renameFolder, deleteFolder, createFolder, createRootFolder, getFolder, getFolders, };