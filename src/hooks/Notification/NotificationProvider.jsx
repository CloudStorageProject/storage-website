import React, { createContext, useContext, useEffect, useState } from "react";
import NotificationManager from "./NotificationManager";
import { NotificationType } from "./NotificationTypes.tsx";
import { ReactComponent as TEMP_IMAGE } from "../../components/img/Warning.svg"
import "./Notifications.css"
import { useLocation } from "react-router-dom";

const NotificationContext = createContext();
let static_id = 0;

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const location = useLocation();
    useEffect(() => {
        setNotifications([]);
    }, [location]);

    const getImage = (type) => {
        // TODO: Update the image with corresponding icon
        switch (type) {
            case NotificationType.WARNING: {
                return <TEMP_IMAGE />
            }
            case NotificationType.INFO: {
                return <TEMP_IMAGE />
            }
            case NotificationType.ERROR: {
                return <TEMP_IMAGE />
            }
            case NotificationType.SUCCESS: {
                return <TEMP_IMAGE />
            }
        }
    }

    const postNotification = (message, type) => {
        // If notification is of general type -> display and set timer
        // If notification is of file type -> clear all previous file notifications -> display current
        // If notification is of file success or failure type -> clear all previous file notifications -> display current and set timer
        let id = static_id;
        static_id += 1;
        const type_string = JSON.stringify(type);
        // id, image, element
        let notification = {};
        if (typeof message !== "string") {
            console.log("Invalid message", message);
            return;
        }
        if (type_string.includes("FILE")) {
            if (type_string.includes("SUCCESS") || type_string.includes("FAILURE")) {
                notification = {
                    id: id,
                    element: (
                        <>
                            {/* TODO: Update the image with corresponding icon */}
                            <TEMP_IMAGE />
                            <p>{message}</p>
                        </>
                    )
                }

                setNotifications([notification]);
                setTimeout(() => {
                    const el = document.querySelector(`.notification[id="${`notification-` + id}"]`);
                    if (el) {
                        el.classList.add("disappear");
                    }
                    setTimeout(() => {
                        setNotifications([]);
                    }, 1000);
                }, 5_000);
            } else {
                notification = {
                    id: id,
                    element: (
                        <>
                            <div className="file-state-notification">
                                <div class="loader" id={`loader-` + id} >{message}</div>
                            </div>
                        </>
                    )
                }
                setNotifications([notification]);
            }
        } else {
            notification = {
                id: id,
                element: (
                    <>
                        {getImage(type)}
                        <p>{message}</p>
                    </>
                )
            }
            setNotifications(prev => [notification, ...prev]);
            setTimeout(() => {
                const el = document.querySelector(`.notification[id="${`notification-` + id}"]`);
                if (el) {
                    el.classList.add("disappear");
                }
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== id));
                }, 1000);
            }, 5_000);
        }
    };

    return (
        <NotificationContext.Provider value={{ postNotification }}>
            {children}
            <NotificationManager notifications={notifications} />
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;

export const useNotify = () => {
    return useContext(NotificationContext);
};
