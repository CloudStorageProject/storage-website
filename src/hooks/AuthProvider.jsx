
import { useContext, createContext, useState, useEffect, useCallback } from "react";
import { exportPrivateKeyFromPem, exportPrivateKeyToBase64, exportPublicKeyFromPem, exportPublicKeyToBase64, signMessage } from "../utils/Cryptography";
import { loginRequest, registerRequest, requestChallenge, submitChallenge } from "../api/authRequests";
import { useNotify } from "./Notification/NotificationProvider";
import { NotificationType } from "./Notification/NotificationTypes.tsx";

const AuthContext = createContext();
export let reLogin = null; // Placeholder for reLogin function, to be defined later

const AuthProvider = ({ children }) => {
    const notify = useNotify();
    const [user, setUser] = useState(getStoredUser());
    const [token, setToken] = useState(getStoredToken());
    const [keyPair, setKeyPair] = useState(getStoredKeyPair());
    // Callback to make compiler stfu
    const storeKeyPairCallback = useCallback(storeKeyPair, [keyPair.privateKey, keyPair.publicKey]);
    const storeTokenCallback = useCallback(storeToken, [token]);
    const storeUserCallback = useCallback(storeUser, [user]);

    useEffect(() => {
        const handlePageLoad = () => {
            getStoredKeyPair();
            getStoredUser();
            getStoredToken();
        }
        const handlePageUnload = () => {
            // If there is token -> store the user for reload.
            if (localStorage.getItem("token") !== null) {
                storeUserCallback();
                storeKeyPairCallback();
                storeTokenCallback();
            }
        }

        window.addEventListener("load", handlePageLoad);
        window.addEventListener("beforeunload", handlePageUnload);
        return (() => {
            window.removeEventListener("load", handlePageLoad);
            window.removeEventListener("beforeunload", handlePageUnload);
        });
    }, [user, keyPair, storeKeyPairCallback, storeTokenCallback, storeUserCallback]);


    function getStoredKeyPair() {
        let privateKey = null;
        let publicKey = null;
        if (localStorage.getItem(`privateKey`) !== null && localStorage.getItem(`publicKey`) !== null) {
            privateKey = exportPrivateKeyFromPem(localStorage.getItem(`privateKey`));
            publicKey = exportPublicKeyFromPem(localStorage.getItem(`publicKey`));
        }
        return { privateKey: privateKey, publicKey: publicKey };
    }

    function storeKeyPair() {
        if (keyPair.privateKey) { localStorage.setItem(`privateKey`, exportPrivateKeyToBase64(keyPair.privateKey)); }
        if (keyPair.publicKey) { localStorage.setItem(`publicKey`, exportPublicKeyToBase64(keyPair.publicKey)); }
    }

    function storeToken(toStore) {
        if (toStore !== null && toStore !== "" && toStore !== undefined) {
            localStorage.setItem(`token`, toStore);
            return;
        } else if (token !== null && token !== undefined && token !== "") {
            localStorage.setItem(`token`, token);
        };
    }

    function getStoredToken() {
        return localStorage.getItem(`token`);
    }

    function getStoredUser() {
        const storedUser = localStorage.getItem(`user`);
        if (storedUser) {
            return JSON.parse(storedUser);
        }
        return { username: null, email: null, fullAccess: false, publicKey: null };
    }

    function storeUser() {
        if (user === null || user.username === null) return;
        localStorage.setItem(`user`, JSON.stringify(user));
    }

    const partialLoginAction = async (data) => {
        try {
            const response = await loginRequest(data);
            if (response.status === 200) {
                response.data.user.fullAccess = false;
                setUser(response.data.user);
                setToken(response.data.token);

                localStorage.setItem(`token`, response.data.token);

                return true;
            } else {
                notify.postNotification(response.data.detail, NotificationType.ERROR);
                console.error(response);
            }
        } catch (err) {
            notify.postNotification(err.response.data.detail, NotificationType.ERROR);
            console.error(err);
        }
        return false;
    };

    const innerReLogin = async () => {
        if (!keyPair.privateKey || !keyPair.publicKey) {
            notify.postNotification("No key pair found", NotificationType.ERROR);
            return false;
        }
        if (user.fullAccess) {
            return fullLoginAction(keyPair);
        } else {
            return partialLoginAction({ username: user.username, password: "", keyPair: keyPair });
        }
    }


    reLogin = innerReLogin;

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

                localStorage.setItem(`token`, response.data.token);
                localStorage.setItem(`privateKey`, exportPrivateKeyToBase64(keys.privateKey));
                localStorage.setItem(`publicKey`, exportPublicKeyToBase64(keys.publicKey));

                return true;
            } else {
                notify.postNotification(response.data.detail, NotificationType.ERROR);
                console.error(response);
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

        localStorage.removeItem(`privateKey`);
        localStorage.removeItem(`publicKey`);
        localStorage.removeItem(`token`);

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

                localStorage.setItem(`privateKey`, exportPrivateKeyToBase64(data.keyPair.privateKey));
                localStorage.setItem(`publicKey`, exportPublicKeyToBase64(data.keyPair.publicKey));

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

    const updateUser = (newUser) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...newUser,
        }));
    }

    return (
        <AuthContext.Provider value={{
            token, user, partialLoginAction, fullLoginAction, registerAction, logOut, keyPair, setKeyPair, storeKeyPair, setStoredUser: storeUser, reLogin, updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;


export const useAuth = () => {
    return useContext(AuthContext);
};
