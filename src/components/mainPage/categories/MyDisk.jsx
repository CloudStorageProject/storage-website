import React, { useState, useRef, useEffect } from "react";
import SearchBar from "./SearchBar";
import "./categories.css";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import { ReactComponent as DragIcon } from "../../img/drag.svg";
import ViewMode from "../ViewModeEnum.js";
import FileGrid from "../elements/FileGrid.jsx";
import FileList from "../elements/FileList.jsx";
import FileControl from "../elements/FileControl.jsx";
import Folder from "../elements/Folder.jsx";

const MyDisk = () => {
  const [viewMode, setViewMode] = useState(ViewMode.GALLERY); // 'list' or 'gallery'
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuPosition = useRef({ top: 0, left: 0 });

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
    {
      id: "file-2",
      name: "File 2",
      image: "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
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
    <div
      className="content-conteiner"
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
              left: viewMode === ViewMode.LIST ? "4px" : "calc(50% + 4px)",
            }}
          />
          <button
            onClick={() => setViewMode(ViewMode.LIST)}
            className={viewMode === ViewMode.LIST ? "active" : ""}
          >
            <ListIcon />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.GALLERY)}
            className={viewMode === ViewMode.GALLERY ? "active" : ""}
          >
            <GalleryIcon />
          </button>
        </div>
      </div>

      <div className={`content ${viewMode}`}>
        {dragActive ? (
          <div className="drag-overlay">
            <div className="drag-bg">
              <DragIcon />
              <p>Drop your files here</p>
            </div>
          </div>
        ) : (
          <>
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
                    return (
                      <FileList
                        key={file.id}
                        file={file}
                        handleMenuToggle={(e) => handleMenuToggle(file.id, e)}
                        menuPosition={menuPosition}
                      />
                    );
                  } else {
                    return (
                      <FileGrid
                        key={file.id}
                        file={file}
                        handleMenuToggle={(e) => handleMenuToggle(file.id, e)}
                        menuPosition={menuPosition}
                      />
                    );
                  }
                })}
                {activeMenu && (
                  <FileControl
                    menuPosition={menuPosition}
                    activeMenu={activeMenu}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyDisk;
