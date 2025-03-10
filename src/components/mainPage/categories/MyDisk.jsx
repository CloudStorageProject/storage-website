import React, { useState, useRef, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import { ReactComponent as DragIcon } from "../../img/drag.svg";
import { ReactComponent as BackIcon } from "../../img/Back Arrow.svg";
import ViewMode from "../ViewModeEnum.js";
import FileGrid from "../elements/FileGrid.jsx";
import FileList from "../elements/FileList.jsx";
import FileControl from "../elements/FileControl.jsx";
import Folder from "../elements/Folder.jsx";
import { getFolder, getRootFolder } from "../../../service/FolderService.jsx";
import { FileStructure, FolderStructure } from "../../../utils/Structures.tsx";
import { uploadFile } from "../../../service/FileService.jsx";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { usePageState } from "../../../hooks/PageContext.jsx";


const MyDisk = ({ }) => {
    const auth = useAuth();
    const page = usePageState();
    const [viewMode, setViewMode] = useState(page.pageState.viewMode); // 'list' or 'gallery'
    const [searchQuery, setSearchQuery] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(page.pageState.currentFolder || null);
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [filePath, setFilePath] = useState("");
    const menuPosition = useRef({ top: 0, left: 0 });

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredFolders = folders.filter((folder) => {
        if (folder) {
            return folder.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
    });

    const filteredFiles = files.filter((file) => {
        if (file.name) {
            return file.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
    });


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

    const handleDrop = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            for (const file of event.dataTransfer.files) {
                await uploadFile(file, page, auth);
            }
            page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
        }
    };


    const handleMenuToggle = useCallback((event) => {
        event.stopPropagation();
        event.preventDefault();
        const target = event.target;
        if (target.id.includes('menu-button') && auth.user.fullAccess) {
            const file_id = parseInt(target.id.replace('menu-button-', ''));
            if (selectedFile === file_id) {
                setSelectedFile(null);
            } else {
                menuPosition.current = {
                    top: event.clientY,
                    left: event.clientX
                };
                setSelectedFile(filteredFiles.filter((file) => file.file_id === file_id)[0]);
            }
        } else {
            setSelectedFile(null);
        }
    }, [files, selectedFile]);

    const updateFilesList = async (selectedFolder) => {
        await getFolder(selectedFolder.id).then((response) => {
            const { data, error } = response;
            if (error) {
                return console.error(error);
            }
            var temp = [];
            for (var i = 0; i < data.folders.length; i++) {
                temp.push(new FolderStructure(data.folders[i].name, data.folders[i].id, data.folders[i].folders, data.folders[i].files));
            }
            setFolders(temp);
            temp = [];
            for (var i = 0; i < data.files.length; i++) {
                temp.push(new FileStructure(selectedFolder.id, data.files[i].id, data.files[i].name, data.files[i].type, data.files[i].format));
            }
            setFiles(temp);
        });
    };

    useEffect(() => {
        const handleResize = () => {

            if (window.innerWidth <= 1024) {
                setViewMode(ViewMode.LIST);
            } else {
                setViewMode(ViewMode.GALLERY);
            }
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener("click", handleMenuToggle);
        return () => {
            window.removeEventListener("click", handleMenuToggle);
            window.removeEventListener("resize", handleResize);
        };
    }, [handleMenuToggle]);

    useEffect(() => {
        if (selectedFolder) {
            updateFilesList(selectedFolder);
            const callstack = Array.from(page.pageState.folderTree || []);
            if (callstack.find((folder) => folder.id === selectedFolder.id) === undefined) {
                callstack.push(selectedFolder);
            }
            setFilePath(callstack.map((folder) => folder.name).join("/"));
            page.setPageState({ ...page.pageState, folderTree: callstack });
        } else {
            getRootFolder().then(async (response) => {
                let { data, error } = response;
                if (error) {
                    return console.error(error);
                }
                const root = new FolderStructure(data.name, data.id, data.folders, data.files);
                setSelectedFolder(root);
                updateFilesList(root);
                setFilePath(root.name);
                page.setPageState({ ...page.pageState, currentPage: "mydisk", currentFolder: data.id, folderTree: [data] });
            }).catch((error) => {
                console.error(error);
            });
        }

    }, [selectedFolder, page.pageState.toUpdate]);


    const handlePreviousFolder = () => {
        const callstack = Array.from(page.pageState.folderTree || []);

        if (callstack.length > 1) {
            callstack.pop();
            setSelectedFolder(callstack[callstack.length - 1]);
            page.setPageState({ ...page.pageState, currentPage: "mydisk", currentFolder: callstack[callstack.length - 1], folderTree: callstack });
        }
    }

    const updateViewMode = (mode) => {
        page.setPageState({ ...page.pageState, viewMode: mode, toUpdate: !page.pageState.toUpdate });
        setViewMode(mode);
    }

    return (
        <div id="content-container" className="content-container" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <header>
                <SearchBar onSearch={handleSearch} />
            </header>
            <div className="view-toggle-container">
                <div className="view-toggle">
                    <div className="slider" style={{ left: viewMode === ViewMode.LIST ? "4px" : "calc(50% + 4px)", }} />
                    <button onClick={() => { updateViewMode(ViewMode.LIST); }} className={viewMode === ViewMode.LIST ? "active" : ""} >
                        <ListIcon />
                    </button>
                    <button onClick={() => { updateViewMode(ViewMode.GALLERY); }} className={viewMode === ViewMode.GALLERY ? "active" : ""} >
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
                                    <Folder key={`folder-` + folder.id} folder={folder} setSelectedFolder={setSelectedFolder} viewMode={viewMode} page={page} />
                                ))}
                            </div>
                        </div>
                        <div className="section">
                            <div className="folder-navigation">
                                <button className="back-folder-button" onClick={() => { handlePreviousFolder() }}><BackIcon /></button>
                                <h2 className="file-title">{filePath}</h2>
                            </div>
                            <div className="items">
                                {filteredFiles.map((file) => {
                                    if (viewMode === ViewMode.LIST) {
                                        return (<FileList key={`file-list-` + file.file_id} file={file} menuPosition={menuPosition} />);
                                    } else {
                                        return (<FileGrid key={`file-grid-` + file.file_id} file={file} menuPosition={menuPosition} />);
                                    }
                                })}
                                {selectedFile && (<FileControl setSelectedFile={setSelectedFile} file={selectedFile} menuPosition={menuPosition} activeMenu={selectedFile} />)}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default MyDisk;

