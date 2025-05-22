const NotificationManager = ({ notifications }) => {
    return (
        <div className="notification-container">
            {notifications.map(({ id, element }) => (
                <div key={id} className={`notification`} id={`notification-` + id}>
                    {element}
                </div>
            ))}
        </div>
    );
};

export default NotificationManager;
