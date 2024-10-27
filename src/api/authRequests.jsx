import AxiosInstance from "./axiosConfig";

const api = AxiosInstance();

export const loginRequest = (data) => {
    return api.post("/login", data);
};


export const registerRequest = (data) => {
    return api.post("/register", data);
}