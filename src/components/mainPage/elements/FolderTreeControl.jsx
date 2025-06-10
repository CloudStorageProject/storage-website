import { useEffect, useState } from "react";
import { getFolder } from "../../../service/FolderService";
import { FolderStructure } from "../../../utils/Structures.tsx";

const FolderTreeControl = ({ id, changeCurrentFolder, menuPosition, page }) => {

    const [folders, setFolders] = useState([]);
    useEffect(() => {
        getFolder(id).then((response) => {
            let { data, error } = response;
            if (error) {
                console.log(error);
            } else {
                data = data.folders;
                var temp = [];
                for (var i = 0; i < data.length; i++) {
                    temp.push(new FolderStructure(data[i].name, data[i].id, data[i].folders, data[i].files));
                }
                setFolders(temp);
            }

        });
    }, [id]);

    return (

        folders && folders.length > 0 ?
            (< div id="menu-list" className="menu-list folder-selector-tree" style={{ top: menuPosition.current.top, left: menuPosition.current.left, position: "absolute", zIndex: 1000, }}>
                {
                    folders && folders.length > 0 && folders.map((folder) => {
                        return (<p key={folder.id} className="folder-selector-element" onClick={() => { changeCurrentFolder(folder, id) }}>{folder.name}</p>);
                    })
                }
            </div>) : null

    );
}

export default FolderTreeControl;