import React, { useState, useEffect, useContext } from "react";
import "./sidebar.css";
import AddFileOptions from "./AddFileOptions";
import { ReactComponent as SettingsIcon } from "../../img/Settings.svg";
import { ReactComponent as MyDiskIcon } from "../../img/MyDisk.svg";
import { ReactComponent as OpenedToMyIcon } from "../../img/OpenedToMe.svg";
import { ReactComponent as TrashIcon } from "../../img/Trash.svg";
import { ReactComponent as ArrowIcon } from "../../img/Arrow.svg";
import { ReactComponent as BackIcon } from "../../img/Backarrow.svg";
import { ThemeContext } from "../../../hooks/ThemeContext";

const Sidebar = ({ onSelectCategory }) => {
    const [activeCategory, setActiveCategory] = useState(() => {
        return localStorage.getItem("activeCategory") || "MyDisk";
    });

    const [progress, setProgress] = useState(90);
    const [isAddingFile, setIsAddingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [isSettingsMode, setIsSettingsMode] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        localStorage.setItem("activeCategory", activeCategory);
    }, [activeCategory]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
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

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSettingsMode ? "settings-mode" : ""}`}>
            <div className="profile">
                <div className="avatar"></div>
                <p className="nickname">nickname</p>
                <button className="settings-btn" onClick={toggleSettingsMode}>
                    {isSettingsMode ? <BackIcon /> : <SettingsIcon style={{ filter: "invert(0)" }} />}
                </button>
            </div>

            {!isSettingsMode ? (
                <>
                    <ul className="menu">
                        <li
                            className={`menu-item ${activeCategory === "MyDisk" ? "active" : ""}`}
                            onClick={() => handleCategoryClick("MyDisk")}
                        >
                            <span>
                                <MyDiskIcon />
                            </span>
                            <span className="name">My disk</span>
                        </li>
                        <li
                            className={`menu-item ${activeCategory === "OpenedToMe" ? "active" : ""}`}
                            onClick={() => handleCategoryClick("OpenedToMe")}
                        >
                            <span>
                                <OpenedToMyIcon />
                            </span>
                            <span className="name">Opened to me</span>
                        </li>
                        <li
                            className={`menu-item ${activeCategory === "Trash" ? "active" : ""}`}
                            onClick={() => handleCategoryClick("Trash")}
                        >
                            <span>
                                <TrashIcon />
                            </span>
                            <span className="name">Trash</span>
                        </li>
                        <AddFileOptions
                            isAddingFile={isAddingFile}
                            onAddFileClick={() => setIsAddingFile(true)}
                            onCreateFolderClick={() => setIsCreatingFolder(true)}
                            isCreatingFolder={isCreatingFolder}
                            folderName={folderName}
                            onFolderNameChange={(e) => setFolderName(e.target.value)}
                            onFolderSubmit={(e) => {
                                e.preventDefault();
                                console.log("Folder created:", folderName);
                                setFolderName("");
                                setIsCreatingFolder(false);
                            }}
                        />
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
                        <li className="menu-item">Log out</li>
                        <li className="menu-item" onClick={toggleTheme}>Change Theme</li>
                    </ul>
                </div>
            )}

            {!isSettingsMode && (
                <button className="collapse-btn" onClick={toggleCollapse}>
                    <ArrowIcon />
                </button>
            )}
        </div>
    );
};

export default Sidebar;
