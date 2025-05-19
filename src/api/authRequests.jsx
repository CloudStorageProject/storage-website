import { axiosInstanceJSON } from "./axiosConfig";
import { exportPublicKeyToBase64 } from "../utils/Cryptography";

//#region Auth
export const loginRequest = async (data) => {
    let user_data = { username: data.username, password: data.password };
    const res = await axiosInstanceJSON.post("/auth/login", user_data);
    return res;
};


export const registerRequest = async (data) => {
    const res = await axiosInstanceJSON.post("/auth/register", data);
    return res;
};

export const requestChallenge = async (publicKey) => {
    const res = await axiosInstanceJSON.get("/auth/login/challenge/" + exportPublicKeyToBase64(publicKey));
    return res;
};

export const submitChallenge = async (publicKey, data) => {
    const res = await axiosInstanceJSON.post("/auth/login/challenge/" + exportPublicKeyToBase64(publicKey), data);
    return res;
};

/**
 * 
 * @returns {Promise}  The response from the server -> {username: string, email: string, public_key: string} 
 */
export const getMe = async () => {
    const res = await axiosInstanceJSON.get("/auth/me");
    return res;
};

export const getUsersByUsername = async (username, pagesize) => {
    if (!pagesize) pagesize = 20;
    const res = await axiosInstanceJSON.get("/users/?username=" + username + "&size=" + pagesize);
    return res;
}

export const getUserPublicKey = async (user_id) => {
    return await axiosInstanceJSON.get("/users/publicKey/" + user_id);
}

export const checkUsernameTaken = async (username) => {
    var data = { username: username };
    const res = await axiosInstanceJSON.post("/auth/checkUsername", data);
    return res;
}

export const checkEmailTaken = async (email) => {
    var data = { email: email };
    const res = await axiosInstanceJSON.post("/auth/checkEmail", data);
    return res;
}
//#endregion Auth