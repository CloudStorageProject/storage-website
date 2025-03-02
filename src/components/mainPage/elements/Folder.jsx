import { ReactComponent as FolderIcon } from "../../img/Folder.svg";
import "./elements.css";

const Folder = ({ folder, viewMode, auth, setSelectedFolder }) => {


    const handleFolderSelect = () => {
        setSelectedFolder(folder.id);
        auth.setPageState({ ...auth.pageState, currentFolder: folder.id, toUpdate: !auth.pageState.toUpdate });
    }

    return (
        <div key={folder.id} className={viewMode === "gallery" ? "folder-grid" : "folder-list"} onDoubleClick={() => { handleFolderSelect(); }}>
            <span className="info">
                <FolderIcon />
                {folder.name}
            </span>
        </div >
    );
}

export default Folder;