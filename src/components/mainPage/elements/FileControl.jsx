import { usePageState } from "../../../hooks/PageContext.jsx";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { deleteFile, downloadFile, } from "../../../service/FileService.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";

const FileControl = ({ menuPosition, handleSharingDialog, setSelectedFile, setSelectedRenaming, file }) => {
    const page = usePageState();
    const auth = useAuth();
    const notify = useNotify();


    const handleDelete = async () => {
        const resp = await deleteFile(file.file_id);
        if (resp.error) {
            notify.postNotification("Failed to delete file", NotificationType.ERROR);
            return
        } else {
            notify.postNotification("File deleted", NotificationType.SUCCESS)
            setSelectedFile(null);
            page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
        }
    }

    const handleRename = () => {
        setSelectedRenaming(file);
    }

    return (
        < div id="menu-list" className="menu-list" style={{ top: menuPosition.current.top, left: menuPosition.current.left, position: "absolute", zIndex: 1000, }}>
            <button onClick={() => { handleDelete(file); }}>Delete</button>
            <button onClick={() => { handleRename(file); }}>Rename</button>
            <button onClick={() => { handleSharingDialog(file); }}>Share</button>
            <button onClick={() => { downloadFile(file, auth.keyPair.privateKey, notify, auth); setSelectedFile(null); }}>Download</button>
        </div >
    );
}

export default FileControl;