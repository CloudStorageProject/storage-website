import { ReactComponent as MoreIcon } from "../../img/More.svg";
import "./elements.css";

const FileList = ({ file }) => {
    return (
        <div key={file.file_id} id={`file-` + file.file_id} className="file-list">
            <img src={file.image} alt={file.name} />
            <div className="file-header">
                <span>{file.name}</span>
                <button className="menu-button" id={`menu-button-` + file.file_id} >
                    <MoreIcon style={{ pointerEvents: "none" }} />
                </button>
            </div>
        </div>
    );
}

export default FileList;