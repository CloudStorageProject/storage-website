import { ReactComponent as FolderIcon } from "../../img/Folder.svg";
import "./elements.css";

const Folder = ({ folder, viewMode, page, setSelectedFolder }) => {


    const handleFolderSelect = () => {
        setSelectedFolder(folder);
        page.setPageState({ ...page.pageState, currentFolder: folder, toUpdate: !page.pageState.toUpdate });
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