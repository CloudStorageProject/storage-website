import { axiosInstanceJSON } from "./axiosConfig";
import { exportPublicKeyToBase64 } from "../utils/Cryptography";

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