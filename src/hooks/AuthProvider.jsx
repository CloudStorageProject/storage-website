
import { useContext, createContext, useState } from "react";

import { loginRequest, registerRequest } from "../api/authRequests";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(document.cookie.split("=")[1] || "");

    const loginAction = async (data) => {
        try {
            const response = await loginRequest(data);
            if (response.status === 200) {
                setUser(response.data.username);
                setToken(response.data.access_token);
                document.cookie = `token=${response.data.access_token}; Secure;`;
                return true;
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        document.cookie = "token=; Secure;";
        return true;
    };

    const registerAction = async (data) => {
        try {
            const response = await registerRequest(data);
            if (response.status === 201) {
                setUser(response.data.username);
                setToken(response.data.access_token);
                document.cookie = `token=${response.data.access_token}; Secure;`;
                return true;
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ token, user, loginAction, registerAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};