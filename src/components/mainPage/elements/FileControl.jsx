const FileControl = ({ menuPosition, activeMenu }) => {

    return (
        < div id="menu-list" className="menu-list" style={{ top: menuPosition.current.top, left: menuPosition.current.left, position: "absolute", zIndex: 1000, }}>
            <button>Open</button>
            <button>Delete</button>
            <button>Rename</button>
            <button>Share</button>
            <button>Duplicate</button>
            <button>Download</button>
        </div >
    );
}

export default FileControl;