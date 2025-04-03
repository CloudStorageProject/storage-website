import { usePageState } from "../../../hooks/PageContext.jsx";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";
import { deleteFolder } from "../../../service/FolderService.jsx";

const FolderControl = ({ menuPosition, setSelectedFolder, changeCurrentFolder, setSelectedRenaming, folder }) => {
    const page = usePageState();
    const auth = useAuth();
    const notify = useNotify();

    const handleDelete = async () => {
        const resp = await deleteFolder(folder.id);
        if (resp.error) {
            notify.postNotification("Failed to delete folder", NotificationType.ERROR);
            return;
        } else {
            notify.postNotification("Folder deleted", NotificationType.SUCCESS)
            setSelectedFolder(null);
            page.setPageState({ ...page.pageState, toUpdate: !page.pageState.toUpdate });
        }
    }

    const handleRename = () => {
        setSelectedRenaming(folder);
    }

    return (
        < div id="menu-list" className="menu-list" style={{ top: menuPosition.current.top, left: menuPosition.current.left, position: "absolute", zIndex: 1000, }}>
            <button onClick={() => { changeCurrentFolder(folder) }}>Open</button>
            <button onClick={() => { handleDelete(folder); }}>Delete</button>
            <button onClick={() => { handleRename(folder); }}>Rename</button>
        </div >
    );
}

export default FolderControl;