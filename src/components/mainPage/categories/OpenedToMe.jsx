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

const OpenedToMe = () => {
    const [viewMode, setViewMode] = useState(ViewMode.GALLERY); // 'list' or 'gallery'
    const [searchQuery, setSearchQuery] = useState("");
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
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-3",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-4",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-125425412",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-3112",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-11523",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-2521631",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-33263642",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-4642626",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-1254643272325412",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-31723756312",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-15326236727427247",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-247274272452342",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-3123156367134745",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-4635434534",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-12542567347132534745412",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-31856745643242312",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-234754876064322341",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-236274568768452",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-364578824236357456547",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-445834525457568",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-125423454347456856787697685412",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-311678870968709568792",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-168755687968798567475647654764576",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-20980687986097895748735647652",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-3625763684386786784567886",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
        {
            id: "file-44658685524762546423645326423",
            name: "File 1",
            image:
                "https://img.freepik.com/free-photo/digital-art-moon-tree-wallpaper_23-2150918811.jpg",
        },
        {
            id: "file-12542556757353764684974567957955987680412",
            name: "File 2",
            image:
                "https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1200.png",
        },
        {
            id: "file-3180698756487566753485364712",
            name: "File 3",
            image:
                "https://cdn.pixabay.com/photo/2023/07/24/07/24/flower-wallpaper-8146421_1280.png",
        },
    ];

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
    }

    const handleMenuToggle = (event) => {
        const id = event.target.id;
        if (!id.includes('menu-button')) {
            setActiveMenu(null);
            return;
        }
        const target = files.find(file => file.id === id.replace('menu-button-', ''));
        if (!target) {
            setActiveMenu(null);
        } else {
            const rect = event.target.getBoundingClientRect();
            menuPosition.current = {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            };
            setActiveMenu(target.id);
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
        <div className="content-conteiner" onScroll={handleScroll}>
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
                                return <FileList key={file.id} file={file} handleMenuToggle={() => { }} menuPosition={menuPosition} />;
                            } else {
                                return <FileGrid key={file.id} file={file} handleMenuToggle={() => { }} menuPosition={menuPosition} />;
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
