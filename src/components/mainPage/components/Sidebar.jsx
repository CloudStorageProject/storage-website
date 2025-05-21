import React, { useEffect, useState } from "react";
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
import { createFolder, getAvailableSpace, getFolder } from "../../../service/FolderService";
import { uploadFile } from "../../../service/FileService";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";
import { FolderStructure } from "../../../utils/Structures.tsx";

const Sidebar = ({ onSelectCategory, activeCategory }) => {
    const auth = useAuth();
    const [storage, setStorage] = useState({
        available: 0,
        used: 0,
        used_percentage: 0,
    });
    const [isAddingFile, setIsAddingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [isSettingsMode, setIsSettingsMode] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const page = usePageState();
    const notify = useNotify();

    useEffect(() => {
        const displayAvailableSpace = () => {
            getAvailableSpace().then((response) => {
                const { data, error } = response;
                if (error) {
                    console.log(error);
                    setStorage({
                        available: 0,
                        used: 0,
                        used_percentage: 0,
                    });
                } else {
                    setStorage({
                        available: data.available.toFixed(2),
                        used: data.used.toFixed(2),
                        used_percentage: data.used_percentage.toFixed(2),
                    });
                }
            }).catch((error) => {
                console.error(error);
                setStorage({
                    available: 0,
                    used: 0,
                    used_percentage: 0,
                });
            });
        }

        displayAvailableSpace();
    }, []);

    const handleCategoryClick = (category) => {
        setIsAddingFile(false);
        setIsCreatingFolder(false);
        onSelectCategory(category);
    };

    const toggleSettingsMode = () => {
        setIsSettingsMode(!isSettingsMode);
    };

    const toggleCollapse = () => {
        if (!isCollapsed) {
            setIsCreatingFolder(false);
            setIsAddingFile(false);
            setFolderName("");
        }
        setIsCollapsed(!isCollapsed);
    };

    const handleLogOut = () => {
        page.clearData();
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

        getFolder(page.pageState.currentFolder.id).then((response) => {
            const { data, error } = response;
            if (error) {
                notify.postNotification("Failed to create folder", NotificationType.ERROR);
                return console.log(error);
            }
            var temp = [];
            for (var i = 0; i < data.folders.length; i++) {
                temp.push(new FolderStructure(data.folders[i].name, data.folders[i].id, data.folders[i].folders, data.folders[i].files));
            }
            if (temp.find(folder => folder.name.toLowerCase() === folderName.toLowerCase())) {
                notify.postNotification("Folder already exists", NotificationType.ERROR);
                return console.log("Folder already exists");
            } else {
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
                        <AddFileOptions isAddingFile={isAddingFile} onAddFileClick={() => handleUploadFile()} isUploadingFile={isUploadingFile} onCreateFolderClick={() => setIsCreatingFolder(true)} isCreatingFolder={isCreatingFolder} folderName={folderName} onFolderNameChange={(e) => setFolderName(e.target.value)} onFolderSubmit={(e) => handleFolderSubmit(e)} />
                    </ul>
                    <div className="storage" title={"You have used: " + storage.used + " GB out of " + storage.available + " GB"}>
                        <p>Storage used: {storage.used} GB</p>
                        {!isCollapsed ? (
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${storage.used_percentage}%` }}></div>
                            </div>
                        ) : (
                            <div className="progress-circle" style={{ '--progress': storage.used_percentage }}>
                                <div className="circle-overlay"></div>
                                <span className="progress-text">{storage.used_percentage}%</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="settings">
                    <ul className="menu">
                        <li className="menu-item" onClick={() => handleCategoryClick("Profile settings")}>Profile settings</li>
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
