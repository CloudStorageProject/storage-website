import { axiosInstanceFORM } from "./axiosConfig";


export const loginRequest = async (data) => {
    let form = new FormData();
    form.append("username", data.username);
    form.append("password", data.password);
    const res = await axiosInstanceFORM.post("/login", form);
    return res;
};


export const registerRequest = async (data) => {
    let form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    form.append("username", data.username);
    form.append("password", data.password);
    const res = await axiosInstanceFORM.post("/register", form);
    return res;
}