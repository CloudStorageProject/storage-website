import React, { useState, useRef, useEffect, act } from "react";
import SearchBar from "./SearchBar";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import { ReactComponent as DragIcon } from "../../img/drag.svg";
import ViewMode from "../ViewModeEnum.js";
import FileGrid from "../elements/FileGrid.jsx";
import FileList from "../elements/FileList.jsx";
import FileControl from "../elements/FileControl.jsx";
import Folder from "../elements/Folder.jsx";


const MyDisk = ({ folders = [], files = [], uploadFile, downloadFile }) => {

    const [viewMode, setViewMode] = useState(ViewMode.GALLERY); // 'list' or 'gallery'
    const [searchQuery, setSearchQuery] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const menuPosition = useRef({ top: 0, left: 0 });

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredFolders = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    }

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const contentContainer = document.getElementById('content-container');
        const { x, y, width, height } = contentContainer.getBoundingClientRect();
        const isWithinBounds =
            event.nativeEvent.clientX > x - contentContainer.style.paddingLeft &&
            event.nativeEvent.clientX < x + width - contentContainer.style.paddingRight &&
            event.nativeEvent.clientY > y - contentContainer.style.paddingTop &&
            event.nativeEvent.clientY < y + height - contentContainer.style.paddingBottom;


        if (!isWithinBounds) {
            setDragActive(false);
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            uploadFile(event.dataTransfer.files);
            event.dataTransfer.clearData();
        }
    };


    const handleMenuToggle = (id, event) => {
        if (selectedFile === id) {
            setSelectedFile(null);
        } else {
            const rect = event.target.getBoundingClientRect();
            menuPosition.current = {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            };
            setSelectedFile(files.filter(id));
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setViewMode(ViewMode.LIST);
            } else {
                setViewMode(ViewMode.GALLERY);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div id="content-container" className="content-container" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <header>
                <SearchBar onSearch={handleSearch} />
            </header>
            <div className="view-toggle-container">
                <div className="view-toggle">
                    <div className="slider" style={{ left: viewMode === ViewMode.LIST ? "4px" : "calc(50% + 4px)", }} />
                    <button onClick={() => setViewMode(ViewMode.LIST)} className={viewMode === ViewMode.LIST ? "active" : ""} >
                        <ListIcon />
                    </button>
                    <button onClick={() => setViewMode(ViewMode.GALLERY)} className={viewMode === ViewMode.GALLERY ? "active" : ""} >
                        <GalleryIcon />
                    </button>
                </div>
            </div>

            {
                dragActive ? (
                    <div className="drag-placeholder">
                        <div className="drag-bg" >
                            <DragIcon />
                        </div>
                    </div>
                ) : (
                    <div className={`content ${viewMode}`}>
                        <div className="section">
                            <h2 className="folder-title">Folders</h2>
                            <div className="items">
                                {filteredFolders.map((folder) => (
                                    <Folder key={folder.id} folder={folder} viewMode={viewMode} />
                                ))}
                            </div>
                        </div>
                        <div className="section">
                            <h2 className="file-title">Files</h2>
                            <div className="items">
                                {filteredFiles.map((file) => {
                                    if (viewMode === ViewMode.LIST) {
                                        return (<FileList key={file.id} file={file} handleMenuToggle={(e) => handleMenuToggle(file.id, e)} menuPosition={menuPosition} />);
                                    } else { return (<FileGrid key={file.id} file={file} handleMenuToggle={(e) => handleMenuToggle(file.id, e)} menuPosition={menuPosition} />); }
                                })}
                                {selectedFile && (<FileControl selectedFile={selectedFile} menuPosition={menuPosition} activeMenu={selectedFile} downloadFile={downloadFile} />)}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default MyDisk;

