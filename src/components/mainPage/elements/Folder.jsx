import { ReactComponent as FolderIcon } from "../../img/Folder.svg";
import "./elements.css";

const Folder = ({ folder, viewMode }) => {
    return (
        <div key={folder.id} className={viewMode === "gallery" ? "folder-grid" : "folder-list"}>
            <span className="info">
                <FolderIcon />
                {folder.name}
            </span>
        </div >
    );
}

export default Folder;