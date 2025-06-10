import { useEffect, useState } from "react";
import { getUsers, grantAccess, revokeAccess } from "../../../service/SharingService.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";
import { UserStructure } from "../../../utils/Structures.tsx";
import UserSharingControl from "./UserSharingControl.jsx";
import { getFileParams } from "../../../service/FileService.jsx";
import { getUserPublicKey } from "../../../api/authRequests.jsx";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { reencryptData } from "../../../utils/Cryptography.jsx";


const SharingDialog = ({ selectedSharing, handleSharingCancel }) => {
    const [selectedUser, setSelectedUser] = useState([]);
    const [file_params, setFileParams] = useState({});
    const [nickname, setNickname] = useState("");
    const [loaded, setLoaded] = useState(false);//To wait for file params
    const [users, setUsers] = useState([]);
    const [receivedFull, setReceivedFull] = useState(false);

    const notify = useNotify();
    const auth = useAuth();


    useEffect(() => {
        if (!selectedSharing) return;

        const getFileParamsPromise = getFileParams(selectedSharing.file_id);
        setLoaded(false);

        getFileParamsPromise.then((response) => {
            let { data, error } = response;
            if (error) {
                console.error(error);
                notify.postNotification("Cannot get file params", NotificationType.ERROR);
                return;
            }
            setFileParams(data);
            setLoaded(true);
        }).catch((error) => {
            notify.postNotification("Network error", NotificationType.NETWORK_ERROR); console.error(error);
            setLoaded(true);
        });
    }, [selectedSharing, notify]);

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        if (e.target.value === "") {
            setUsers([]);
        } else {
            getUsers(e.target.value).then((response) => {
                let { data, error } = response;
                if (error) {
                    console.error(error);
                    notify.postNotification("Cannot get users", NotificationType.ERROR);
                    return;
                }
                let temp = [];
                for (let i = 0; i < data.page_size; i++) {
                    if (data.users[i].username === auth.user.username) {// skip self
                        continue;
                    }
                    temp.push(new UserStructure(data.users[i].id, data.users[i].username));
                }
                setUsers(temp);
                setReceivedFull(temp.length === 20);
            }).catch((error) => {
                notify.postNotification("Network error", NotificationType.NETWORK_ERROR); console.error(error);
            });
        }
    }

    const handleCancelSharing = () => {
        setNickname("");
        setSelectedUser([]);
        handleSharingCancel();
    }

    const handleGrantAccess = (user) => {
        getUserPublicKey(user.id).then((response) => {
            let { data, error } = response;
            if (error) {
                console.error(error);
                notify.postNotification("Cannot get user data", NotificationType.ERROR);
                return;
            }
            const prepared_data = reencryptData(auth.keyPair.privateKey, data.pub_key, { iv: file_params.encrypted_iv, key: file_params.encrypted_key });
            grantAccess(user, selectedSharing, prepared_data).then((response) => {
                if (response.error) {
                    console.error(response.error);
                    notify.postNotification("Failed to grant access", NotificationType.ERROR);
                    return;
                }
                notify.postNotification("Access granted", NotificationType.SUCCESS);
                file_params.shared.push(user.id);
            }).catch((error) => {
                console.error(error);
                notify.postNotification("Network error", NotificationType.ERROR);
            });
        }).catch((error) => {
            console.error(error);
            notify.postNotification("Network error", NotificationType.ERROR);
        });
    }

    const handleRevokeAccess = (user) => {
        revokeAccess(user, selectedSharing).then((response) => {
            if (response.error) {
                notify.postNotification("Failed to revoke access", NotificationType.ERROR);
                console.log(response.error);
                return;
            }
            notify.postNotification("Access revoked", NotificationType.SUCCESS);
            file_params.shared.splice(file_params.shared.indexOf(user.id), 1);
        }).catch((error) => {
            console.error(error);

            notify.postNotification("Network error", NotificationType.ERROR);
        });
    }

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const scrollHeight = e.target.scrollHeight;
        const clientHeight = e.target.clientHeight;
        const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
        console.log(`Scroll Position: ${scrollPercent.toFixed(2)}%`);
        if (scrollPercent.toFixed(2) >= 80 && !receivedFull) {
            // TODO: Implement lazy loading
        }
    }

    return (
        <dialog id="sharing-dialog" className="sharing-dialog" open={true}>
            <div className="sharing-content">
                <span>Share with</span>
                <input disabled={!loaded} type="text" className="sharing-input" placeholder="User Nickname" value={nickname} onChange={(e) => { handleNicknameChange(e); }} id="" />
                <div className="sharing-users" onScroll={(e) => { handleScroll(e); }}>
                    {
                        users && users.map((user) => {
                            return (
                                <UserSharingControl key={user.id} handleGrantAccess={handleGrantAccess} handleRevokeAccess={handleRevokeAccess} file_params={file_params} user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                            );
                        })
                    }
                </div>
                <button className="cancel-button" onClick={handleCancelSharing}>Cancel</button>
            </div>
        </dialog>
    );
}

export default SharingDialog;