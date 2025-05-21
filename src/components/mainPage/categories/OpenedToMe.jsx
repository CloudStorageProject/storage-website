import React, { useState, useRef, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import ViewMode from "../ViewModeEnum.js";
import FileGrid from "../elements/FileGrid.jsx";
import FileList from "../elements/FileList.jsx";
import { FileStructure } from "../../../utils/Structures.tsx";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { usePageState } from "../../../hooks/PageContext.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";
import OpenToMeFileControl from "../elements/OpenToMeFileControl.jsx";
import { getShared } from "../../../api/FolderRequests.jsx";


const OpenedToMe = ({ }) => {
    const auth = useAuth();
    const page = usePageState();
    const notify = useNotify();
    const [viewMode, setViewMode] = useState(page.pageState.viewMode); // 'list' or 'gallery'
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const fileMenuPosition = useRef({ top: 0, left: 0 });

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredFiles = files.filter((file) => {
        if (file.name) {
            return file.name.toLowerCase().includes(searchQuery.toLowerCase())
        }
    });

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
                setSelectedFile(filteredFiles.filter((file) => file.file_id === file_id)[0]);
            }
        } else {
            setSelectedFile(null);
        }
    }, [files, selectedFile]);


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
        getShared().then((response) => {
            const { data, error } = response;
            if (error) {
                notify.postNotification("Error whilst retrieving files", NotificationType.ERROR);
                return;
            }
            let temp = [];
            data.forEach((file) => {
                temp.push(new FileStructure(0, file.file_id, file.name, file.type, file.format, file.encrypted_key, file.encrypted_iv));
            });
            setFiles(temp);
        }).catch((error) => {
            notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
        });
    }, []);

    const updateViewMode = (mode) => {
        page.setPageState({ ...page.pageState, viewMode: mode, toUpdate: !page.pageState.toUpdate });
        setViewMode(mode);
    }

    return (
        <div id="content-container" className="content-container" >
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
                    {selectedFile && (<OpenToMeFileControl setSelectedFile={setSelectedFile} file={selectedFile} menuPosition={fileMenuPosition} activeMenu={selectedFile} />)}
                </div>
            </div>

        </div >
    );
};

export default OpenedToMe;

