const UserSharingControl = ({ user, file_params, selectedUser, setSelectedUser, handleGrantAccess, handleRevokeAccess }) => {

    return (
        <div className="user-sharing-selection" onClick={() => { setSelectedUser(user) }}>
            <p className="sharing-username">{user.username}</p>
            {
                user.id === selectedUser.id ?
                    <div className="sharing-buttons">
                        <button disabled={file_params.shared.includes(user.id)} onClick={() => { handleGrantAccess(user); }}>Grant</button>
                        <button disabled={!file_params.shared.includes(user.id)} onClick={() => { handleRevokeAccess(user); }}>Revoke</button>
                    </div>
                    : null
            }
        </div>
    );
}

export default UserSharingControl;