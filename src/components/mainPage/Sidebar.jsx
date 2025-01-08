import React, { useState, useEffect } from "react";
import "./sidebar.css";
import { ReactComponent as SettingsIcon } from "../img/Settings.svg";
import { ReactComponent as MyDiskIcon } from "../img/MyDisk.svg";
import { ReactComponent as OpenedToMyIcon } from "../img/OpenedToMe.svg";
import { ReactComponent as TrashIcon } from "../img/Trash.svg";

const Sidebar = ({ onSelectCategory }) => {
    const [activeCategory, setActiveCategory] = useState(() => {
        return localStorage.getItem("activeCategory") || "MyDisk";
    });

    useEffect(() => {
        localStorage.setItem("activeCategory", activeCategory);
    }, [activeCategory]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category); 
        onSelectCategory(category);
    };

    return (
        <div className="sidebar">
            <div className="profile">
                <div className="avatar"></div>
                <p className="nickname">nickname</p>
                <button className="settings-btn"><SettingsIcon /></button>
            </div>
            <ul className="menu">
                <li
                    className={`menu-item ${activeCategory === "MyDisk" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("MyDisk")}
                >
                    <span><MyDiskIcon /></span> My disk
                </li>
                <li
                    className={`menu-item ${activeCategory === "OpenedToMe" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("OpenedToMe")}
                >
                    <span><OpenedToMyIcon /></span> Opened to me
                </li>
                <li
                    className={`menu-item ${activeCategory === "Trash" ? "active" : ""}`}
                    onClick={() => handleCategoryClick("Trash")}
                >
                    <span><TrashIcon /></span> Trash
                </li>
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
