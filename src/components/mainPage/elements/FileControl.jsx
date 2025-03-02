import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { deleteFile, downloadFile, } from "../../../service/FileService.jsx";

const FileControl = ({ menuPosition, setSelectedFile, file }) => {
    const auth = useAuth();

    const handleDelete = async (file) => {
        await deleteFile(file.file_id);
        setSelectedFile(null);
        auth.setPageState({ ...auth.pageState, toUpdate: !auth.pageState.toUpdate });
    }

    const handleRename = (file) => {
        // TODO: Implement rename input window
        // renameFile(file.file_id, "newName");
    }

    return (
        < div id="menu-list" className="menu-list" style={{ top: menuPosition.current.top, left: menuPosition.current.left, position: "absolute", zIndex: 1000, }}>
            <button onClick={() => { handleDelete(file); setSelectedFile(null); }}>Delete</button>
            <button onClick={() => { handleRename(file); setSelectedFile(null); }}>Rename</button>
            <button>Share</button>
            <button onClick={() => { downloadFile(file, auth.keyPair.privateKey); setSelectedFile(null); }}>Download</button>
        </div >
    );
}

export default FileControl;