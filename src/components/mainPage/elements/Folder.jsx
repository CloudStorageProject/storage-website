import { ReactComponent as FolderIcon } from "../../img/Folder.svg";
import "./elements.css";
import { ReactComponent as MoreIcon } from "../../img/More.svg";

const Folder = ({ folder, viewMode, page, setCurrentFolder }) => {


    const handleFolderSelect = () => {
        setCurrentFolder(folder);
        page.setPageState({ ...page.pageState, currentFolder: folder, toUpdate: !page.pageState.toUpdate });
    }

    return (
        <div key={folder.id} className={viewMode === "gallery" ? "folder-grid" : "folder-list"} onDoubleClick={() => { handleFolderSelect(); }}>
            <div className="folder">
                <div className="info">
                    <FolderIcon />
                    {folder.name}
                </div>
                <button className="menu-button" id={`menu-button-folder-` + folder.id} >
                    <MoreIcon style={{ pointerEvents: "none" }} />
                </button>
            </div>
        </div >
    );
}

export default Folder;