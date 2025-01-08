import React, { useState } from "react";
import SearchBar from "./SearchBar"; 
import "./categories.css";
import { ReactComponent as GalleryIcon } from "../../img/Gallery.svg";
import { ReactComponent as ListIcon } from "../../img/List.svg";
import { ReactComponent as FolderIcon } from "../../img/Folder.svg";
import { ReactComponent as MoreIcon } from "../../img/More.svg";




const OpenedToMe = () => {
  const [viewMode, setViewMode] = useState("gallery"); // 'list' or 'gallery'
  const [searchQuery, setSearchQuery] = useState("");

  const folders = [
    { id: 1, name: "Folder 1" },
    { id: 2, name: "Folder 2" },
    { id: 3, name: "Folder 3" },
    { id: 1, name: "Folder 1" },
    { id: 2, name: "Folder 2" },
    { id: 3, name: "Folder 3" },
  ];

  const files = [
    { id: 1, name: "File 1", image: "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg" },
    { id: 2, name: "File 2", image: "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png" },
    { id: 3, name: "File 3", image: "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png" },
    { id: 1, name: "File 1", image: "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg" },
    { id: 2, name: "File 2", image: "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png" },
    { id: 3, name: "File 3", image: "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png" },
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

  return (
    <div className="app">
      <header>
        <SearchBar onSearch={handleSearch} />
      </header>
    <div className="view-toggle-container">
      <div className="view-toggle">
        <div className="slider" style={{ left: viewMode === "list" ? "4px" : "calc(50% + 4px)" }} />
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
        <div className="section">
          <h2>Folders</h2>
          <div className="items">
            {filteredFolders.map((folder) => (
              <div key={folder.id} className="folder">
                <span className="info">
                  <FolderIcon/>
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
                  <button className="menu-button"><MoreIcon/></button>
                </div>
                <img src={file.image} alt={file.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenedToMe;
