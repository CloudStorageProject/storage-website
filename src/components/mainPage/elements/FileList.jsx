import { ReactComponent as MoreIcon } from "../../img/More.svg";
import "./elements.css";

const FileList = ({ file }) => {
    return (
        <div key={file.id} className="file-list">
            <img src={file.image} alt={file.name} />
            <div className="file-header">
                <span>{file.name}</span>
                <button className="menu-button" id={`menu-button-` + file.id} >
                    <MoreIcon style={{ pointerEvents: "none" }} />

                </button>
            </div>
        </div>
    )
}

export default FileList;