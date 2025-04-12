import axios from "axios";

const AxiosInstance = ({ content_type }) => {

    const instance = axios.create({
        baseURL: window.__ENV__.REACT_APP_API_URL,
        headers: {
            "Content-Type": content_type,
        },
    });


    instance.interceptors.request.use(
        (config) => {
            config.headers["Authorization"] = `Bearer ${document.cookie.split("=")[1] || ""}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    // TODO: configure response interceptor
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
}

export const axiosInstanceJSON = AxiosInstance("application/json");

export const axiosInstanceFORM = AxiosInstance("multipart/form-data");