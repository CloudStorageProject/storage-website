import AxiosInstance from "./axiosConfig";

const api = AxiosInstance();

export const loginRequest = async (data) => {
    const res = await api.post("/login", data);
    return JSON.parse(res.data);
};


export const registerRequest = async (data) => {
    const res = await api.post("/register", data);
    return JSON.parse(res.data);
}