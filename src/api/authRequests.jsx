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
}