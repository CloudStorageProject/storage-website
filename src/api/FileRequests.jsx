import { axiosInstanceJSON } from "./axiosConfig";

//#region Files
/**
 * 
 * @param {Object} file_data -> {folder_id:int, name:string, type:string, format:string, encrypted_key:string, encrypted_iv:string,content:string}
 * @returns File id
 */
export const uploadFileRequest = async (file_data) => {
    const res = await axiosInstanceJSON.post("/files/", file_data);
    return res;
}

/**
 * 
 * @param {int} id id of the file
 * @returns encoded string
 */
export const getFileRequest = async (id) => {
    const res = await axiosInstanceJSON.get("/files/" + id);
    return res;
}

export const getFileParamsRequest = async (id) => {
    const res = await axiosInstanceJSON.get("/files/" + id + "/params");
    return res;
}

/**
 * 
 * @param {int} id id of the file
 * @param {object} data -> {new_name:string}
 * @returns ?
 */
export const renameFileRequest = async (id, data) => {
    const res = await axiosInstanceJSON.patch("/files/" + id, data);
    return res;
}

export const deleteFileRequest = async (id) => {
    const res = await axiosInstanceJSON.delete("/files/" + id);
    return res;
}

export const allowFileSharingRequest = async (file_id, user_id, data) => {
    return await axiosInstanceJSON.post("/files/" + file_id + "/share/" + user_id, data);
}

export const deleteFileSharingRequest = async (file_id, user_id) => {
    return await axiosInstanceJSON.delete("/files/" + file_id + "/share/" + user_id);
}


//#endregion Files