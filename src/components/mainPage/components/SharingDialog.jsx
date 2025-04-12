import { useState } from "react";
import { getUsers } from "../../../service/SharingService.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";
import React from "react";
import { UserStructure } from "../../../utils/Structures.tsx";
import UserSharingControl from "./UserSharingControl.jsx";


const SharingDialog = ({ selectedSharing, setSelectedSharing, handleSharingCancel }) => {
    const [nickname, setNickname] = useState("");
    const [selectedUser, setSelectedUser] = useState([]);
    const [users, setUsers] = useState([]);
    const notify = useNotify();

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        if (e.target.value === "") {
            setUsers([]);
            return;
        }
        getUsers(e.target.value).then((response) => {
            let { data, error } = response;
            if (error) {
                notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
                return;
            }
            let temp = [];
            for (let i = 0; i < data.page_size; i++) {
                temp.push(new UserStructure(data.users[i].id, data.users[i].username));
            }
            setUsers(temp);
        }).catch((error) => {
            notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
        });
    }
    const handleCancelSharing = () => {
        setNickname("");
        setSelectedUser([]);
        handleSharingCancel();
    }


    return (
        <dialog id="sharing-dialog" className="sharing-dialog" open={true}>
            <div className="sharing-content">
                <span>Share with</span>
                <input type="text" className="sharing-input" placeholder="User Nickname" value={nickname} onChange={(e) => { handleNicknameChange(e); }} id="" />
                <div className="sharing-users">
                    {
                        users && users.map((user) => {
                            return (
                                <UserSharingControl key={user.id} user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
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