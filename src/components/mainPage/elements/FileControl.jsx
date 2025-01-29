import { deleteFile, renameFile } from "../../../service/FileService";

const FileControl = ({ menuPosition, downloadFile, file }) => {
    const handleDelete = (file) => {
        // TODO: Handle delete
        deleteFile(file.id);
    }
    const handleRename = (file) => {
        // TODO: Implement rename input window
        renameFile(file.id, "newName");
    }

    return (
        < div id="menu-list" className="menu-list" style={{ top: menuPosition.current.top, left: menuPosition.current.left, position: "absolute", zIndex: 1000, }}>
            <button>Open</button>
            <button onClick={handleDelete(file)}>Delete</button>
            <button onClick={handleRename(file)}>Rename</button>
            <button>Share</button>
            <button>Duplicate</button>
            <button onClick={downloadFile(file)}>Download</button>
        </div >
    );
}

export default FileControl;