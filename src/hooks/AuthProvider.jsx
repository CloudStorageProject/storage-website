
import { useContext, createContext, useState, useEffect } from "react";
import { exportPrivateKeyFromPem, exportPrivateKeyToBase64, exportPublicKeyFromPem, exportPublicKeyToBase64, signMessage } from "../utils/Cryptography";
import { loginRequest, registerRequest, requestChallenge, submitChallenge } from "../api/authRequests";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
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
            setStoredUser();
            storeKeyPair();
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

    function getStoredUser() {
        const storedUser = localStorage.getItem("user");

        if ((keyPair.privateKey !== null && keyPair.publicKey !== null) || (storedUser !== null || storedUser !== "null" || storedUser !== "undefined" || storedUser !== undefined)) {
            setUser(storedUser ? JSON.parse(storedUser) : null);
            navigate("/storage");
        } else {
            navigate("/login");
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
            console.error(err);
        }
        return false;
    };

    const fullLoginAction = async () => {
        try {
            const message = await requestChallenge(keyPair.publicKey);

            let signedMessage = Buffer.from(signMessage(message.data.challenge, keyPair.privateKey), "binary").toString("base64");
            const data = { challenge: message.data.challenge, sign: signedMessage };
            const response = await submitChallenge(keyPair.publicKey, data);
            if (response.status === 200) {
                response.data.user.fullAccess = true;
                setUser(response.data.user);
                setToken(response.data.token);
                document.cookie = `token=${response.data.token}; Secure;`;
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
        localStorage.removeItem("privateKey");
        localStorage.removeItem("publicKey");
        setKeyPair({ privateKey: null, publicKey: null });
        return true;
    };

    const registerAction = async (data) => {
        try {
            const prepared_data = data;
            prepared_data.public_key = exportPublicKeyToBase64(data.keyPair.publicKey);
            const response = await registerRequest(data);
            if (response.status === 200) {
                setUser(response.data.user);
                setToken(response.data.access_token);
                document.cookie = `token=${response.data.access_token}; Secure;`;
                return true;
            } else if (response.status === 422) {
                // TODO: show error message
                console.error(response);
            }
        } catch (err) {
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
