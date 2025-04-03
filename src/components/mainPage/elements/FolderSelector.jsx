import { ReactComponent as List } from "../../img/List.svg";

const FolderSelector = ({ folder, changeCurrentFolder }) => {

    return (
        <div id={`folder-selector-` + folder.id} className="folder-selector" onDoubleClick={() => { changeCurrentFolder(folder) }} >
            <p className="folder-name">{folder.name}</p>
            <button className="inner-folders-dropdown-button" id={`inner-folders-dropdown-button-` + folder.id} >
                <List style={{ pointerEvents: "none" }} />
            </button>
        </div>
    );
}

export default FolderSelector;