import React, { useState, useRef } from "react";
import SearchBar from "./SearchBar";
import "./categories.css";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import { ReactComponent as FolderIcon } from "../../img/Folder.svg";
import { ReactComponent as MoreIcon } from "../../img/More.svg";
import { ReactComponent as DragIcon } from "../../img/drag.svg";



const MyDisk = () => {
  const [viewMode, setViewMode] = useState("gallery"); // 'list' or 'gallery'
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuPosition = useRef({ top: 0, left: 0 });
  
  

  const handleMenuToggle = (id, event) => {
    if (activeMenu === id) {
      setActiveMenu(null); 
    } else {
      const rect = event.target.getBoundingClientRect();
      menuPosition.current = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      };
      setActiveMenu(id); 
    }
  };

  const folders = [
    { id: "folder-1", name: "Folder 1" },
    { id: "folder-2", name: "Folder 2" },
    { id: "folder-3", name: "Folder 3" },
  ];

  const files = [
    {
      id: "file-1",
      name: "File 1",
      image:
        "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDrag = (event) => {
    event.preventDefault();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      className="app"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <header>
        <SearchBar onSearch={handleSearch} />
      </header>

      <div className="view-toggle-container">
        <div className="view-toggle">
          <div
            className="slider"
            style={{
              left: viewMode === "list" ? "4px" : "calc(50% + 4px)",
            }}
          />
          <button
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "active" : ""}
          >
            <ListIcon />
          </button>
          <button
            onClick={() => setViewMode("gallery")}
            className={viewMode === "gallery" ? "active" : ""}
          >
            <GalleryIcon />
          </button>
        </div>
      </div>

      <div className={`content ${viewMode}`}>
        {dragActive ? (
          <div className="drag-overlay">
            <div className="drag-bg">
              <DragIcon/>
            </div>
          </div>
        ) : (
          <>
            <div className="section">
              <h2>Folders</h2>
              <div className="items">
                {filteredFolders.map((folder) => (
                  <div key={folder.id} className="folder">
                    <span className="info">
                      <FolderIcon />
                      {folder.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="section">
              <h2>Files</h2>
              <div className="items">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="file">
                    <div className="file-header">
                      <span>{file.name}</span>
                      <button
                                        className="menu-button"
                                        onClick={(e) => handleMenuToggle(file.id, e)}
                                      >
                                        <MoreIcon />
                                      </button>
                    </div>
                    <img src={file.image} alt={file.name} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyDisk;
