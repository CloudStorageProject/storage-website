import "./elements.css";
import { ReactComponent as MoreIcon } from "../../img/More.svg";

const FileGrid = ({ file }) => {
    return (
        <div key={file.file_id} id={`file-` + file.file_id} className="file-grid">
            <div className="file-header">
                <span>{file.name}</span>
                <button className="menu-button" id={`menu-button-` + file.file_id} >
                    <MoreIcon style={{ pointerEvents: "none" }} />
                </button>
            </div>
            <img src={file.image} alt={file.name} />
        </div>
    );
}

export default FileGrid;