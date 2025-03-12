
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

    const fullLoginAction = async (keyPair) => {
        try {
            const message = await requestChallenge(keyPair.publicKey);
            let signedMessage = Buffer.from(signMessage(message, keyPair.privateKey), "utf-8").toString("base64");
            const data = { challenge: message, sign: signedMessage };
            const response = await submitChallenge(keyPair.publicKey, data);
            if (response.status === 200) {
                setUser(response.data.username);
                // TODO: get user from api endpoint /me
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
            data.public_key = exportPublicKeyToBase64(data.keyPair.publicKey);
            delete data.keyPair;
            const response = await registerRequest(data);
            if (response.status === 200) {
                setUser(response.data);
                setToken(response.data.access_token);
                document.cookie = `token=${response.data.access_token}; Secure;`;
                localStorage.setItem("privateKey", exportPrivateKeyToBase64(data.keyPair.privateKey));
                localStorage.setItem("publicKey", exportPublicKeyToBase64(data.keyPair.publicKey));
                return true;
            } else if (response.status === 422) {
                // TODO: show error message
                console.log(response);
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