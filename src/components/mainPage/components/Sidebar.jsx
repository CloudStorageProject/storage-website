import React, { useState, useEffect } from "react";
import "./sidebar.css";
import AddFileOptions from "./AddFileOptions";
import { ReactComponent as SettingsIcon } from "../../img/Settings.svg";
import { ReactComponent as MyDiskIcon } from "../../img/MyDisk.svg";
import { ReactComponent as OpenedToMyIcon } from "../../img/OpenedToMe.svg";
import { ReactComponent as TrashIcon } from "../../img/Trash.svg";
import { ReactComponent as ArrowIcon } from "../../img/Arrow.svg";  

const Sidebar = ({ onSelectCategory }) => {
    const [activeCategory, setActiveCategory] = useState(() => {
        return localStorage.getItem("activeCategory") || "MyDisk";
    });

    const [progress, setProgress] = useState(90); 
    const [isAddingFile, setIsAddingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        localStorage.setItem("activeCategory", activeCategory);
    }, [activeCategory]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setIsAddingFile(false);
        setIsCreatingFolder(false);
        onSelectCategory(category);
    };

    const handleAddFileClick = () => {
        setIsAddingFile(true);
        setIsCreatingFolder(false);
    };

    const handleCreateFolderClick = () => {
        setIsCreatingFolder(true);
    };

    const handleFolderNameChange = (event) => {
        setFolderName(event.target.value);
    };

    const handleCreateFolderSubmit = (event) => {
        event.preventDefault();
        console.log("Folder created:", folderName);
        setFolderName("");
        setIsCreatingFolder(false);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <div className="profile">
                <div className="avatar"></div>
                <p className="nickname">nickname</p>
                <button className="settings-btn">
                    <SettingsIcon />
                </button>
            </div>
            <ul className="menu">
                <li
                    className={`menu-item ${activeCategory === "MyDisk" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("MyDisk")}
                >
                    <span>
                        <MyDiskIcon />
                    </span>{" "}
                    <span className="name">My disk</span>
                </li>
                <li
                    className={`menu-item ${activeCategory === "OpenedToMe" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("OpenedToMe")}
                >
                    <span>
                        <OpenedToMyIcon />
                    </span>{" "}
                    <span className="name">Opened to me</span>
                </li>
                <li
                    className={`menu-item ${activeCategory === "Trash" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Trash")}
                >
                    <span>
                        <TrashIcon />
                    </span>{" "}
                    <span className="name">Trash</span>
                </li>
                <AddFileOptions
                    isAddingFile={isAddingFile}
                    onAddFileClick={handleAddFileClick}
                    onCreateFolderClick={handleCreateFolderClick}
                    isCreatingFolder={isCreatingFolder}
                    folderName={folderName}
                    onFolderNameChange={handleFolderNameChange}
                    onFolderSubmit={handleCreateFolderSubmit}
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
            <button className="collapse-btn" onClick={toggleCollapse}>
                <ArrowIcon />
            </button>
        </div>
    );
};

export default Sidebar;
