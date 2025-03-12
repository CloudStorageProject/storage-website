import React, { useState } from "react";
import "./sidebar.css";
import AddFileOptions from "./AddFileOptions";
import { ReactComponent as SettingsIcon } from "../../img/Settings.svg";
import { ReactComponent as MyDiskIcon } from "../../img/MyDisk.svg";
import { ReactComponent as OpenedToMyIcon } from "../../img/OpenedToMe.svg";
import { ReactComponent as TrashIcon } from "../../img/Trash.svg";
import { ReactComponent as ArrowIcon } from "../../img/Arrow.svg";
import { ReactComponent as BackIcon } from "../../img/Backarrow.svg";
import { usePageState } from "../../../hooks/PageContext.jsx";
import { useAuth } from "../../../hooks/AuthProvider";
import { createFolder } from "../../../service/FolderService";
import { uploadFile } from "../../../service/FileService";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";

const Sidebar = ({ onSelectCategory, activeCategory }) => {
    const auth = useAuth();
    const [progress, setProgress] = useState(90);
    const [isAddingFile, setIsAddingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [isSettingsMode, setIsSettingsMode] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const page = usePageState();
    const notify = useNotify();

    const handleCategoryClick = (category) => {
        setIsAddingFile(false);
        setIsCreatingFolder(false);
        onSelectCategory(category);
    };

    const toggleSettingsMode = () => {
        setIsSettingsMode(!isSettingsMode);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogOut = () => {
        auth.logOut();
    }

    const isUploadingFile = () => {
        setIsAddingFile(true);
        setIsCreatingFolder(false);
    }
    const handleUploadFile = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = async function () {
            for (const file of input.files) {
                await uploadFile(file, page, auth, notify);
            }
            page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
        }
        input.click();
    };

    const handleFolderSubmit = async (event) => {
        event.preventDefault();

        createFolder({ id: page.pageState.currentFolder.id, name: folderName }).then((response) => {
            const { data, error } = response;
            if (error) {
                notify.postNotification("Failed to create folder", NotificationType.ERROR);
                return console.log(error);
            } else {
                notify.postNotification("Created folder: " + folderName, NotificationType.SUCCESS);
            }
            setIsCreatingFolder(false);
            setFolderName("");
            page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
        });
    }

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSettingsMode ? "settings-mode" : ""}`}>
            <div className="profile">
                <div className="avatar"></div>
                <p className="nickname">{auth.user.username}</p>
                <button className="settings-btn" onClick={toggleSettingsMode}>
                    {isSettingsMode ? <BackIcon /> : <SettingsIcon style={{ filter: "invert(1)" }} />}
                </button>
            </div>

            {!isSettingsMode ? (
                <>
                    <ul className="menu">
                        <li className={`menu-item ${activeCategory === "MyDisk" ? "active" : ""}`} onClick={() => handleCategoryClick("MyDisk")}>
                            <span>
                                <MyDiskIcon />
                            </span>
                            <span className="name">My disk</span>
                        </li>
                        <li className={`menu-item ${activeCategory === "OpenedToMe" ? "active" : ""}`} onClick={() => handleCategoryClick("OpenedToMe")}>
                            <span>
                                <OpenedToMyIcon />
                            </span>
                            <span className="name">Opened to me</span>
                        </li>
                        <li className={`menu-item ${activeCategory === "Trash" ? "active" : ""}`} onClick={() => handleCategoryClick("Trash")}>
                            <span>
                                <TrashIcon />
                            </span>
                            <span className="name">Trash</span>
                        </li>
                        <AddFileOptions isAddingFile={isAddingFile} onAddFileClick={() => handleUploadFile()} isUploadingFile={isUploadingFile} onCreateFolderClick={() => setIsCreatingFolder(true)} isCreatingFolder={isCreatingFolder} folderName={folderName} onFolderNameChange={(e) => setFolderName(e.target.value)} onFolderSubmit={(e) => handleFolderSubmit(e)} />
                    </ul>
                    <div className="storage">
                        <p>Storage used</p>
                        {!isCollapsed ? (
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${progress}%` }}></div>
                            </div>
                        ) : (
                            <div className="progress-circle" style={{ '--progress': progress }}>
                                <div className="circle-overlay"></div>
                                <span className="progress-text">{progress}%</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="settings">
                    <ul className="menu">
                        <li className="menu-item">Profile settings</li>
                        <li className="menu-item">Support</li>
                        <li className="menu-item">Language</li>
                        <li className="menu-item" onClick={handleLogOut}>Log out</li>
                        <li className="menu-item" onClick={page.toggleTheme}>Change Theme</li>
                    </ul>
                </div>
            )}

            {!isSettingsMode && (
                <button className="collapse-btn" onClick={toggleCollapse}>
                    <ArrowIcon className="collapse-btn-anim" />
                </button>
            )}
        </div>
    );
};

export default Sidebar;
