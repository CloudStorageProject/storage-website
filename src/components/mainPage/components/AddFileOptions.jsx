import React from "react";

const AddFileOptions = ({
    isAddingFile,
    onAddFileClick,
    onCreateFolderClick,
    isCreatingFolder,
    folderName,
    onFolderNameChange,
    onFolderSubmit,
}) => {
    return (
        <>
            {isAddingFile ? (
                <div className="addfile-options">
                    <button className="addfile">Upload File</button>
                    <button className="addfile" onClick={onCreateFolderClick}>
                        Create Folder
                    </button>
                </div>
            ) : (
                <li className="addfile" onClick={onAddFileClick}>
                    Add File
                </li>
            )}
            {isCreatingFolder && (
                <form className="create-folder-form" onSubmit={onFolderSubmit}>
                    <label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={onFolderNameChange}
                            placeholder="Folder Name"
                        />
                    </label>
                    <button type="submit" className="create-folder-btn">
                        Create Folder
                    </button>
                </form>
            )}
        </>
    );
};

export default AddFileOptions;
