import "./elements.css";
import { ReactComponent as MoreIcon } from "../../img/More.svg";
import { FileType } from "../../../utils/Structures.tsx";
import { ReactComponent as Image_svg } from "../../img/FileType Image.svg";
import { ReactComponent as Video_svg } from "../../img/FileType Video.svg";
import { ReactComponent as Audio_svg } from "../../img/FileType Audio.svg";
import { ReactComponent as Document_svg } from "../../img/FileType Document.svg";

const FileGrid = ({ file }) => {
    const getImage = (file) => {
        switch (file.type) {
            case FileType.AUDIO: {
                return <Audio_svg />;
            }
            case FileType.DOCUMENT:
            case FileType.TEXT: {
                return <Document_svg />;
            }
            case FileType.IMAGE: {
                return <Image_svg />;
            }
            case FileType.VIDEO: {
                return <Video_svg />;
            }
            default: {
                return <Document_svg />;
            }
        }
    }

    return (
        <div key={file.file_id} id={`file-` + file.file_id} className="file-grid">
            <div className="file-header">
                <p className="file-name">{file.name}</p>
                <button className="menu-button" id={`menu-button-file-` + file.file_id} >
                    <MoreIcon style={{ pointerEvents: "none" }} />
                </button>
            </div>
            {getImage(file)}
        </div>
    );
}

export default FileGrid;