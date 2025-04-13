
import { useContext, createContext, useState, useEffect } from "react";
import { exportPrivateKeyFromPem, exportPrivateKeyToBase64, exportPublicKeyFromPem, exportPublicKeyToBase64, signMessage } from "../utils/Cryptography";
import { loginRequest, registerRequest, requestChallenge, submitChallenge } from "../api/authRequests";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./Notification/NotificationProvider";
import { NotificationType } from "./Notification/NotificationTypes.tsx";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const notify = useNotify();
    const [user, setUser] = useState({ username: null, email: null, fullAccess: false, publicKey: null });
    const [token, setToken] = useState(document.cookie.split("=")[1] || "");
    const [keyPair, setKeyPair] = useState({ privateKey: null, publicKey: null });


    useEffect(() => {
        const handlePageLoad = () => {
            getStoredUser();
            getKeyPair();
            localStorage.removeItem("user");
            localStorage.removeItem("privateKey");
            localStorage.removeItem("publicKey");
        }
        const handlePageUnload = () => {
            // If there is token -> store the user for reload.
            if (document.cookie.split("=")[1]) {
                setStoredUser();
                storeKeyPair();
            }
        }

        window.addEventListener("load", handlePageLoad);
        window.addEventListener("beforeunload", handlePageUnload);
        return (() => {
            window.removeEventListener("load", handlePageLoad);
            window.removeEventListener("beforeunload", handlePageUnload);
        });
    }, [user, keyPair]);

    function getKeyPair() {
        let privateKey = null;
        let publicKey = null;
        if (localStorage.getItem("privateKey") !== null && localStorage.getItem("publicKey") !== null) {
            privateKey = exportPrivateKeyFromPem(localStorage.getItem("privateKey"));
            publicKey = exportPublicKeyFromPem(localStorage.getItem("publicKey"));
        }
        setKeyPair({ privateKey: privateKey, publicKey: publicKey });
    }

    function storeKeyPair() {
        if (keyPair.privateKey) { localStorage.setItem("privateKey", exportPrivateKeyToBase64(keyPair.privateKey)); }
        if (keyPair.publicKey) { localStorage.setItem("publicKey", exportPublicKeyToBase64(keyPair.publicKey)); }
    }

    async function getStoredUser() {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(await JSON.parse(storedUser));
        }
    }

    function setStoredUser() {
        localStorage.setItem("user", JSON.stringify(user));
    }

    const partialLoginAction = async (data) => {
        try {
            const response = await loginRequest(data);
            if (response.status === 200) {
                response.data.user.fullAccess = false;
                setUser(response.data.user);
                setToken(response.data.token);
                document.cookie = `token=${response.data.token}; Secure;`;
                return true;
            }
        } catch (err) {
            notify.postNotification(err.response.data.detail, NotificationType.ERROR);
            console.error(err);
        }
        return false;
    };

    const fullLoginAction = async (keys) => {
        try {
            const message = await requestChallenge(keys.publicKey);

            let signedMessage = Buffer.from(signMessage(message.data.challenge, keys.privateKey), "binary").toString("base64");
            const data = { challenge: message.data.challenge, sign: signedMessage };
            const response = await submitChallenge(keys.publicKey, data);
            if (response.status === 200) {
                response.data.user.fullAccess = true;
                setUser(response.data.user);
                setToken(response.data.token);
                document.cookie = `token=${response.data.token}; Secure;`;
                return true;
            }
        } catch (err) {
            notify.postNotification(err.response.data.detail, NotificationType.ERROR);
            console.error(err);
        }
        return false;
    };

    const logOut = () => {
        setUser(null);
        setToken("");
        document.cookie = "token=; Secure;";
        localStorage.removeItem("privateKey");
        localStorage.removeItem("publicKey");
        setKeyPair({ privateKey: null, publicKey: null });
        return true;
    };

    const registerAction = async (data) => {
        try {
            const prepared_data = data;
            prepared_data.public_key = exportPublicKeyToBase64(data.keyPair.publicKey);
            const response = await registerRequest(prepared_data);
            if (response.status === 200) {
                setUser(response.data.user);
                setToken(response.data.access_token);
                document.cookie = `token=${response.data.access_token}; Secure;`;
                localStorage.setItem("privateKey", exportPrivateKeyToBase64(data.keyPair.privateKey));
                localStorage.setItem("publicKey", exportPublicKeyToBase64(data.keyPair.publicKey));
                return true;
            } else if (response.status === 422) {
                notify.postNotification(response.data.detail, NotificationType.ERROR);
                console.error(response);
            }
        } catch (err) {
            notify.postNotification(err.response.data.detail, NotificationType.ERROR);
            console.error(err);
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            token, user, partialLoginAction, fullLoginAction, registerAction, logOut, keyPair, setKeyPair
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
