import React from "react";
import { useAuth } from "../../../hooks/AuthProvider";

const AddFileOptions = ({ isAddingFile, onAddFileClick, isUploadingFile, onCreateFolderClick, isCreatingFolder, folderName, onFolderNameChange, onFolderSubmit, }) => {
    const auth = useAuth();

    return (
        <>
            {isAddingFile ? (
                <div className="addfile-options">
                    <button className="addfile" onClick={onAddFileClick}>Upload File</button>
                    <button className="addfile" onClick={onCreateFolderClick}> Create Folder </button>
                </div>
            ) : (
                <li className={"addfile" + (auth.user.fullAccess ? "" : " inactive")} onClick={() => { if (auth.user.fullAccess) isUploadingFile(); }}> Add File </li>
            )}
            {isCreatingFolder && (
                <form className="create-folder-form" onSubmit={onFolderSubmit}>
                    <label>
                        <input type="text" value={folderName} onChange={onFolderNameChange} placeholder="Folder Name" />
                    </label>
                    <button type="submit" className="create-folder-btn"> Create Folder</button>
                </form>
            )}
        </>
    );
};

export default AddFileOptions;
