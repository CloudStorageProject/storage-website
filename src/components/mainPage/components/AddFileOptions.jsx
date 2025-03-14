import React from "react";
import { useAuth } from "../../../hooks/AuthProvider";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";

const AddFileOptions = ({ isAddingFile, onAddFileClick, isUploadingFile, onCreateFolderClick, isCreatingFolder, folderName, onFolderNameChange, onFolderSubmit, }) => {
    const auth = useAuth();
    const notify = useNotify();

    const checkAllowance = () => {
        if (auth.user.fullAccess) {
            isUploadingFile();
        } else {
            notify.postNotification("You need to log in with secret phrases to modify the files", NotificationType.INFO)
        }
    }

    return (
        <>
            {isAddingFile ? (
                <div className="addfile-options">
                    <button className="addfile" onClick={onAddFileClick}>Upload File</button>
                    <button className="addfile" onClick={onCreateFolderClick}> Create Folder </button>
                </div>
            ) : (
                <li className={"addfile" + (auth.user.fullAccess ? "" : " inactive")} onClick={checkAllowance}> Add File </li>
            )}
            {isCreatingFolder && (
                <form className="create-folder-form" onSubmit={onFolderSubmit}>
                    <label>
                        <input type="text" value={folderName} onChange={onFolderNameChange} placeholder="Folder Name" />
                    </label>
                    <button onClick={onFolderSubmit} className="create-folder-btn">Create Folder</button>
                </form>
            )}
        </>
    );
};

export default AddFileOptions;
