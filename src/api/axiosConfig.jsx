import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";


const AxiosInstance = () => {
    const authHeader = useAuthHeader();
    const token = authHeader();

    const instance = axios.create({
        baseURL: "", // TODO: Specify base URL
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });


    instance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
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
export default AxiosInstance;