const UserSharingControl = ({ user, selectedUser, setSelectedUser }) => {
    return (
        <div className="user-sharing-selection" onClick={() => { setSelectedUser(user) }}>
            <p className="sharing-username">{user.username}</p>
            {
                user.id === selectedUser.id ?
                    <div className="sharing-buttons">
                        <button>Share</button>
                        <button>Revoke</button>
                    </div>
                    : null
            }
        </div>
    );
}

export default UserSharingControl;