import React, { useState, useRef, useEffect } from "react";
import SearchBar from "./SearchBar";
import "./categories.css";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import ViewMode from "../ViewModeEnum.js";
import FileGrid from "../elements/FileGrid.jsx";
import FileList from "../elements/FileList.jsx";
import FileControl from "../elements/FileControl.jsx";
import Folder from "../elements/Folder.jsx";


let lastOpen = "";
const OpenedToMe = ({ folders = [], files = [], error = null }) => {
    const [viewMode, setViewMode] = useState(ViewMode.GALLERY); // 'list' or 'gallery'
    const [searchQuery, setSearchQuery] = useState("");
    const [activeMenu, setActiveMenu] = useState(null);
    const menuPosition = useRef({ top: 0, left: 0 });


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setViewMode(ViewMode.LIST);
            } else {
                setViewMode(ViewMode.GALLERY);
            }
        }


        window.addEventListener('resize', handleResize);
        window.addEventListener('click', handleMenuToggle);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', handleMenuToggle);
        };
    }, []);
    const handleScroll = () => {
        setActiveMenu(null);
        lastOpen = '';
    }

    const handleMenuToggle = (event) => {
        const id = event.target.id;
        if (!id.includes('menu-button')) {
            setActiveMenu(null);
            lastOpen = '';
            return;
        }
        const target = files.find(file => file.id === id.replace('menu-button-', ''));

        if (!target || target.id == lastOpen) {
            setActiveMenu(null);
            lastOpen = '';
        } else {
            const rect = event.target.getBoundingClientRect();
            menuPosition.current = {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            };
            setActiveMenu(target.id);
            lastOpen = target.id;
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="content-container" onScroll={handleScroll}>
            <header>
                <SearchBar onSearch={handleSearch} />
            </header>
            <div className="view-toggle-container">
                <div className="view-toggle">
                    <div className="slider" style={{ left: viewMode === ViewMode.LIST ? "4px" : "calc(50% + 4px)", }} />
                    <button onClick={() => setViewMode(ViewMode.LIST)} className={viewMode === ViewMode.LIST ? "active" : ""}>
                        <ListIcon />
                    </button>
                    <button onClick={() => setViewMode(ViewMode.GALLERY)} className={viewMode === ViewMode.GALLERY ? "active" : ""}>
                        <GalleryIcon />
                    </button>
                </div>
            </div>

            <div className={`content ${viewMode}`}>
                <div className="section">
                    <h2 className="folder-title">Folders</h2>
                    <div className="items">
                        {filteredFolders.map((folder) => (<Folder key={folder.id} folder={folder} viewMode={viewMode} />))}
                    </div>
                </div>
                <div className="section">
                    <h2 className="file-title">Files</h2>
                    <div className="items">
                        {filteredFiles.map((file) => {
                            if (viewMode === ViewMode.LIST) {
                                return <FileList key={file.id} file={file} menuPosition={menuPosition} />;
                            } else {
                                return <FileGrid key={file.id} file={file} menuPosition={menuPosition} />;
                            }
                        })}
                        {activeMenu && <FileControl menuPosition={menuPosition} activeMenu={activeMenu} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenedToMe;
