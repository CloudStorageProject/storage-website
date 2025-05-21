import { axiosInstanceJSON } from "./axiosConfig";

export const SetPasswordRequest = async (old_password, new_password) => {
    const data = {
        old_password: old_password,
        password: new_password
    }
    const res = await axiosInstanceJSON.patch("/settings/password", data);
    return res;
}

export const SetUsernameRequest = async (old_password, new_username) => {
    const data = {
        old_password: old_password,
        username: new_username
    }
    const res = await axiosInstanceJSON.patch("/settings/username", data);
    return res;
}

export const GetPaymentsRequest = async () => {
    const res = await axiosInstanceJSON.get("/payments/overview");
    return res;
}

export const SetPaymentRequest = async (plan) => {
    const data = {
        name: plan
    }
    const res = await axiosInstanceJSON.post("/payments/subscribe", data);
    return res;
}