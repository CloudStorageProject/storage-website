import { usePageState } from "../../../hooks/PageContext.jsx";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { deleteFile, downloadFile, } from "../../../service/FileService.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";

const OpenToMeFileControl = ({ menuPosition, setSelectedFile, file }) => {
    const auth = useAuth();
    const notify = useNotify();



    return (
        < div id="menu-list" className="menu-list" style={{ top: menuPosition.current.top, left: menuPosition.current.left, position: "absolute", zIndex: 1000, }}>
            <button onClick={() => { downloadFile(file, auth.keyPair.privateKey, notify); setSelectedFile(null); }}>Download</button>
        </div >
    );
}

export default OpenToMeFileControl;