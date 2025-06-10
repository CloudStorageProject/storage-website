import { useState, useRef, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import { ReactComponent as DragIcon } from "../../img/drag.svg";
import ViewMode from "../ViewModeEnum.js";
import FileGrid from "../elements/FileGrid.jsx";
import FileList from "../elements/FileList.jsx";
import FileControl from "../elements/FileControl.jsx";
import Folder from "../elements/Folder.jsx";
import { getFolder, getRootFolder, renameFolder } from "../../../service/FolderService.jsx";
import { determineFileType, FileStructure, FolderStructure } from "../../../utils/Structures.tsx";
import { renameFile, uploadFile } from "../../../service/FileService.jsx";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { usePageState } from "../../../hooks/PageContext.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";
import FolderControl from "../elements/FolderControl.jsx";
import FolderSelector from "../elements/FolderSelector.jsx";
import FolderTreeControl from "../elements/FolderTreeControl.jsx";
import SharingDialog from "../components/SharingDialog.jsx";


const MyDisk = () => {
    const auth = useAuth();
    const page = usePageState();
    const notify = useNotify();
    const [viewMode, setViewMode] = useState(page.pageState.viewMode); // 'list' or 'gallery'
    const [searchQuery, setSearchQuery] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFolderTree, setSelectedFolderTree] = useState(null);
    const [currentFolder, setCurrentFolder] = useState(page.pageState.currentFolder || null);
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedRenaming, setSelectedRenaming] = useState(null);
    const [renamingName, setRenamingName] = useState("");
    const fileMenuPosition = useRef({ top: 0, left: 0 });
    const folderMenuPosition = useRef({ top: 0, left: 0 });
    const folderTreeMenuPosition = useRef({ top: 0, left: 0 });
    const [selectedSharing, setSelectedSharing] = useState(null);


    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredFolders = folders.filter((folder) => {
        return folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    });

    const filteredFiles = files.filter((file) => {
        return file.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                await uploadFile(file, page, auth, notify, page.pageState.currentFolder.id);
            }
            page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
        }
    };


    const handleMenuToggle = useCallback((event) => {
        event.stopPropagation();
        event.preventDefault();
        const target = event.target;
        if (target.id.includes('menu-button-file')) {
            if (!auth.user.fullAccess) {
                notify.postNotification("You need to log in with secret phrases to modify the files", NotificationType.INFO);
                return;
            }
            const file_id = parseInt(target.id.replace('menu-button-file-', ''));
            if (selectedFile === file_id) {
                setSelectedFile(null);
            } else {
                fileMenuPosition.current = {
                    top: event.clientY,
                    left: event.clientX
                };
                setSelectedFolder(null);
                setSelectedFolderTree(null);
                setSelectedFile(filteredFiles.filter((file) => file.file_id === file_id)[0]);
            }
        } else if (target.id.includes('menu-button-folder')) {
            if (!auth.user.fullAccess) {
                notify.postNotification("You need to log in with secret phrases to modify the folders", NotificationType.INFO);
                return;
            }
            const folder_id = parseInt(target.id.replace('menu-button-folder-', ''));
            if (selectedFolder === folder_id) {
                setSelectedFolder(null);
            } else {
                folderMenuPosition.current = {
                    top: event.clientY,
                    left: event.clientX
                };
                setSelectedFile(null);
                setSelectedFolderTree(null);
                setSelectedFolder(filteredFolders.filter((file) => file.id === folder_id)[0]);
            }
        } else if (target.id.includes('inner-folders-dropdown-button')) {
            const id = parseInt(target.id.replace('inner-folders-dropdown-button-', ''));
            if (selectedFolderTree === id) {
                setSelectedFolderTree(null);
            } else {
                folderTreeMenuPosition.current = {
                    top: event.clientY,
                    left: event.clientX
                };
                setSelectedFile(null);
                setSelectedFolder(null);
                setSelectedFolderTree(id);
            }
        } else {
            setSelectedFile(null);
            setSelectedFolder(null);
            setSelectedFolderTree(null);
        }
    }, [auth.user.fullAccess, filteredFiles, filteredFolders, notify, selectedFile, selectedFolder, selectedFolderTree]);

    const updateFilesList = (selectedFolder) => {
        getFolder(selectedFolder.id).then((response) => {
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
            console.log(data.files);

            for (var i = 0; i < data.files.length; i++) {
                temp.push(new FileStructure(
                    selectedFolder.id,
                    data.files[i].id,
                    data.files[i].name.split('.')[0],
                    data.files[i].type,
                    data.files[i].format
                ));
            }
            setFiles(temp);
        });
    };


    // Resize effect
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

    // Load effect
    useEffect(() => {
        if (currentFolder) {
            updateFilesList(currentFolder);
            const callstack = Array.from(page.pageState.folderTree || []);
            if (callstack.find((folder) => folder.id === currentFolder.id) === undefined) {
                callstack.push(currentFolder);
            }
            page.setPageState({ ...page.pageState, folderTree: callstack, currentFolder: currentFolder });
        } else {
            getRootFolder().then(async (response) => {
                let { data, error } = response;
                if (error) {
                    return console.error(error);
                }
                const root = new FolderStructure(data.name, data.id, data.folders, data.files);
                setCurrentFolder(root);
                updateFilesList(root);
                page.setPageState({ ...page.pageState, currentPage: "mydisk", currentFolder: root, folderTree: [root] });
            }).catch((error) => {
                console.error(error);
            });
        }

    }, [page.pageState.currentFolder, page.pageState.toUpdate]);

    const updateViewMode = (mode) => {
        page.setPageState({ ...page.pageState, viewMode: mode, toUpdate: !page.pageState.toUpdate });
        setViewMode(mode);
    }

    const handleSharingDialog = (file) => {
        setSelectedSharing(file);
    }

    const handleSharingCancel = () => {
        document.getElementById('sharing-dialog').classList.add('disappear');
        setTimeout(() => {
            setSelectedSharing(null);
        }, 1_000);
    }

    const handleRename = async () => {

        if (renamingName === "") {
            notify.postNotification("Name cannot be empty", NotificationType.ERROR);
            return;
        }
        if (selectedRenaming instanceof FolderStructure) {
            if (renamingName === selectedRenaming.name) {
                notify.postNotification("Folder name is the same", NotificationType.ERROR);
                return;
            } else if (filteredFolders.filter((folder) => folder.name === renamingName).length > 0) {
                notify.postNotification("Folder name already exists", NotificationType.ERROR);
                return;
            }

            const resp = await renameFolder(selectedRenaming.id, { name: renamingName });
            if (resp.error) {
                notify.postNotification("Failed to rename folder", NotificationType.ERROR);
                return;
            } else {
                notify.postNotification("Folder renamed", NotificationType.SUCCESS)
                page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
            }
        } else {
            if (renamingName === selectedRenaming.name) {
                notify.postNotification("File name is the same", NotificationType.ERROR);
                return;
            } else if (filteredFiles.filter((file) => file.name === renamingName).length > 0) {
                notify.postNotification("File name already exists", NotificationType.ERROR);
                return;
            }
            const resp = await renameFile(selectedRenaming.file_id, { new_name: renamingName });
            if (resp.error) {
                notify.postNotification("Failed to rename file", NotificationType.ERROR);
                return;
            } else {
                notify.postNotification("File renamed", NotificationType.SUCCESS)
                page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
            }
        }

        document.getElementById('rename-dialog').classList.add('disappear');
        setTimeout(() => {
            setSelectedRenaming(null);
            setRenamingName("");
        }, 1_000);
    }

    const handleRenameChange = (event) => {
        setRenamingName(event.target.value);
    }

    const handleRenameCancel = () => {
        document.getElementById('rename-dialog').classList.add('disappear');
        setTimeout(() => {
            setSelectedRenaming(null);
            setRenamingName("");
        }, 1_000);
    }

    const changeFolderTree = (folder, parentID) => {
        // If there is parent id -> remove all except parent and set current as folder
        // If there is no parent id -> remove all except parent
        let tree = Array.from(page.pageState.folderTree || []);
        if (parentID) {
            tree = tree.splice(0, tree.findIndex((f) => f.id === parentID) + 1);
            tree.push(folder);
        } else {
            tree = tree.splice(0, tree.findIndex((f) => f.id === folder.id) + 1);
        }
        setCurrentFolder(folder);
        page.setPageState({ ...page.pageState, currentFolder: folder, toUpdate: !page.pageState.toUpdate, folderTree: tree });
    }


    const changeCurrentFolder = (folder, parentID) => {
        let tree = Array.from(page.pageState.folderTree || []);
        tree.push(folder);
        setCurrentFolder(folder);
        page.setPageState({ ...page.pageState, currentFolder: folder, toUpdate: !page.pageState.toUpdate, folderTree: tree });
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
                        <div className="folder-navigation">
                            {
                                page.pageState.folderTree && page.pageState.folderTree.length > 0 && page.pageState.folderTree.map((folder, index) => (
                                    <FolderSelector folder={folder} changeCurrentFolder={changeFolderTree} key={`folder-selector-` + folder.id} page={page} />
                                ))
                            }
                        </div>
                        <div className="section">
                            <h2 className="folder-title">Folders</h2>
                            <div className="items">
                                {
                                    filteredFolders.map((folder) => (
                                        <Folder key={`folder-` + folder.id} folder={folder} changeCurrentFolder={changeCurrentFolder} viewMode={viewMode} page={page} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="section">

                            <div className="items">
                                {
                                    filteredFiles.map((file) => {
                                        if (viewMode === ViewMode.LIST) {
                                            return (<FileList key={`file-list-` + file.file_id} file={file} menuPosition={fileMenuPosition} />);
                                        } else {
                                            return (<FileGrid key={`file-grid-` + file.file_id} file={file} menuPosition={fileMenuPosition} />);
                                        }
                                    })
                                }
                                {selectedFile && (<FileControl handleSharingDialog={handleSharingDialog} setSelectedFile={setSelectedFile} setSelectedRenaming={setSelectedRenaming} file={selectedFile} menuPosition={fileMenuPosition} activeMenu={selectedFile} />)}
                                {selectedFolder && (<FolderControl setSelectedFolder={setSelectedFolder} setSelectedRenaming={setSelectedRenaming} changeCurrentFolder={changeCurrentFolder} setCurrentFolder={setCurrentFolder} folder={selectedFolder} menuPosition={folderMenuPosition} activeMenu={selectedFolder} />)}
                                {selectedFolderTree && (<FolderTreeControl id={selectedFolderTree} changeCurrentFolder={changeFolderTree} menuPosition={folderTreeMenuPosition} activeMenu={selectedFolderTree} />)}
                            </div>
                        </div>
                    </div>
                )
            }
            {
                selectedRenaming && (
                    <dialog id="rename-dialog" className="rename-dialog" open={true}>
                        <div className="rename-content">
                            <p>Renaming <span>{selectedRenaming.name}</span></p>
                            <input type="text" className="rename-input" placeholder="New Name" value={renamingName} onChange={(e) => { handleRenameChange(e); }} name="rename" id="" />
                            <div className="rename-controls">
                                <button onClick={() => { handleRenameCancel(); }}>Cancel</button>
                                <button onClick={() => { handleRename(); }}>Rename</button>
                            </div>

                        </div>
                    </dialog>
                )
            }
            {
                selectedSharing && (
                    <SharingDialog selectedSharing={selectedSharing} handleSharingCancel={handleSharingCancel} />
                )
            }
        </div >
    );
};

export default MyDisk;

