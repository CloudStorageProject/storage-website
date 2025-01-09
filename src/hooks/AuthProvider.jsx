
import { useContext, createContext, useState } from "react";
import { exportPrivateKeyToBase64, exportPublicKeyToBase64, signMessage } from "../utils/Cryptography";
import { loginRequest, registerRequest, requestChallenge, submitChallenge } from "../api/authRequests";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(document.cookie.split("=")[1] || "");

    const partialLoginAction = async (data) => {
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

    const fullLoginAction = async (userData, keyPair) => {
        try {
            let signedMessage = signMessage(await requestChallenge(keyPair.publicKey), keyPair.privateKey);
            const data = { username: userData.username, password: userData.password, signedMessage: signedMessage };
            const response = await submitChallenge(keyPair.publicKey, data);
            if (response.status === 200) {
                setUser(response.data.username);
                setToken(response.data.access_token);
                document.cookie = `token=${response.data.access_token}; Secure;`;
                return true;
            }
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.setItem("privateKey", exportPrivateKeyToBase64(keyPair.privateKey));
            localStorage.setItem("publicKey", exportPublicKeyToBase64(keyPair.publicKey));
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
        <AuthContext.Provider value={{ token, user, partialLoginAction, fullLoginAction, registerAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};