import axios from "axios";

const AxiosInstance = ({ content_type }) => {

    const instance = axios.create({
        baseURL: "http://127.0.0.1:5000", // TODO: Specify base URL
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
            console.log(response);
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    instance.defaults.headers.common["Access-Control-Allow-Credentials"] = "true";
    return instance;
}

export const axiosInstanceJSON = AxiosInstance("application/json");

export const axiosInstanceFORM = AxiosInstance("multipart/form-data");