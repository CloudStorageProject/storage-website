import "./elements.css";
import { ReactComponent as MoreIcon } from "../../img/More.svg";

const FileGrid = ({ file, handleMenuToggle }) => {
    return (<div key={file.id} id={file.id} className="file-grid">
        <div className="file-header">
            <span>{file.name}</span>
            <button className="menu-button" id={`menu-button-` + file.id} onClick={(e) => handleMenuToggle(file.id, e)}>
                <MoreIcon style={{ pointerEvents: "none" }} />
            </button>
        </div>
        <img src={file.image} alt={file.name} />
    </div>
    );
}

export default FileGrid;