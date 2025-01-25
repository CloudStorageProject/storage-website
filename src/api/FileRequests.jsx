import { axiosInstanceJSON } from "./axiosConfig";

//#region Files
/**
 * 
 * @param {Object} file_data -> {folder_id:int, name:string, type:string, format:string, encrypted_key:string, encrypted_iv:string,content:string}
 * @returns File id
 */
export const uploadFileRequest = async (file_data) => {
    const res = await axiosInstanceJSON.post("/files/upload", file_data);
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
    const res = await axiosInstanceJSON.get("/files/params" + id);
    return res;
}

/**
 * 
 * @param {int} id id of the file
 * @param {object} data -> {new_name:string}
 * @returns ?
 */
export const renameFileRequest = async (id, data) => {
    const res = await axiosInstanceJSON.patch("/files/rename/" + id, data);
    return res;
}

export const deleteFileRequest = async (id) => {
    const res = await axiosInstanceJSON.delete("/files/delete/" + id);
    return res;
}
//#endregion Files