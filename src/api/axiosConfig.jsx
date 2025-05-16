import axios from "axios";
import { reLogin } from "../hooks/AuthProvider";

const AxiosInstance = ({ content_type }) => {

    const instance = axios.create({
        baseURL: window.__ENV__.REACT_APP_API_URL,
        headers: {
            "Content-Type": content_type,
        },
    });


    instance.interceptors.request.use(
        (config) => {
            config.headers["Authorization"] = `Bearer ${localStorage.getItem("token") || ""}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            if (error && error.response && error.response.status === 401) {
                if (await reLogin()) {
                    const originalRequest = error.config;
                    const newRequest = {
                        ...originalRequest, headers: { ...originalRequest.headers, Authorization: `Bearer ${localStorage.getItem("token")}`, },
                    };
                    console.log("Retrying request with new token");
                    return instance(newRequest);
                } else {
                    console.error("Re-login failed");
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
}

export const axiosInstanceJSON = AxiosInstance("application/json");