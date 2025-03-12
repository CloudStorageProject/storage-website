import { axiosInstanceJSON } from "./axiosConfig";

//#region Folders
export const getFoldersRequest = async () => {
    const res = await axiosInstanceJSON.get("/folders/");
    return res;
};

export const getFolderRequest = async (id) => {
    const res = await axiosInstanceJSON.get("/folders/" + id);
    return res;
};

/**
 * 
 * @param {string} name -> name of the folder
  */
export const createRootFolderRequest = async (name) => {
    const res = await axiosInstanceJSON.post("/folders/", name);
    return res;
};

export const createFolderRequest = async (id, data) => {
    const res = await axiosInstanceJSON.post("/folders/" + id, data);
    return res;
};

export const renameFolderRequest = async (id, data) => {
    const res = await axiosInstanceJSON.patch("/folders/" + id, data);
    return res;
};

export const deleteFolderRequest = async (id) => {
    const res = await axiosInstanceJSON.delete("/folders/" + id);
    return res;
};

//#endregion Folders
