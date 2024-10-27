import api from "./axiosConfig";


export const loginRequest = (data) => {
    return api.post("/login", data);
};


export const registerRequest = (data) => {
    return api.post("/register", data);
}