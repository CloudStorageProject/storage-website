import AxiosInstance from "./axiosConfig";


export const loginRequest = async (data) => {
    const api = AxiosInstance();
    const res = await api.post("/login", data);
    return JSON.parse(res.data);
};


export const registerRequest = async (data) => {
    const api = AxiosInstance();
    const res = await api.post("/register", data);
    return JSON.parse(res.data);
}