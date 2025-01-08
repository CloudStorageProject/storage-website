import { axiosInstanceJSON } from "./axiosConfig";


export const loginRequest = async (data) => {
    let user_data = { username: data.username, password: data.password };
    const res = await axiosInstanceJSON.post("/login", user_data);
    return res;
};


export const registerRequest = async (data) => {
    let user_data = {
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password
    }
    const res = await axiosInstanceJSON.post("/register", user_data);
    return res;
};

export const requestChallenge = async (publicKey) => {
    const res = await axiosInstanceJSON.get("/auth/login/challenge/" + publicKey);
    return res;
};

export const submitChallenge = async (publicKey, data) => {
    const res = await axiosInstanceJSON.post("/auth/login/challenge/" + publicKey, data);
    return res;
};