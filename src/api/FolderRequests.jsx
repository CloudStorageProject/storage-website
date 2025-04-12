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
export const createRootFolderRequest = async (id, name) => {
    const res = await axiosInstanceJSON.post("/folders/", name);
    return res;
};

export const createFolderRequest = async (data) => {
    const res = await axiosInstanceJSON.post("/folders/" + data.id, { name: data.name });
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

export const getAvailableUserSpace = async () => {
    const res = await axiosInstanceJSON.get("/folders/space");
    return res;
}

//#endregion Folders
