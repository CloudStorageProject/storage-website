import React, { useState, useEffect } from "react";
import "./sidebar.css";
import AddFileOptions from "./AddFileOptions";
import { ReactComponent as SettingsIcon } from "../../img/Settings.svg";
import { ReactComponent as MyDiskIcon } from "../../img/MyDisk.svg";
import { ReactComponent as OpenedToMyIcon } from "../../img/OpenedToMe.svg";
import { ReactComponent as TrashIcon } from "../../img/Trash.svg";

const Sidebar = ({ onSelectCategory }) => {
    const [activeCategory, setActiveCategory] = useState(() => {
        return localStorage.getItem("activeCategory") || "MyDisk";
    });

    const [isAddingFile, setIsAddingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderName, setFolderName] = useState("");

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

    return (
        <div className="sidebar">
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
                    My disk
                </li>
                <li
                    className={`menu-item ${activeCategory === "OpenedToMe" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("OpenedToMe")}
                >
                    <span>
                        <OpenedToMyIcon />
                    </span>{" "}
                    Opened to me
                </li>
                <li
                    className={`menu-item ${activeCategory === "Trash" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Trash")}
                >
                    <span>
                        <TrashIcon />
                    </span>{" "}
                    Trash
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
                <div className="progress-bar">
                    <div className="progress"></div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
