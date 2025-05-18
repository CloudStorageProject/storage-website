import React, { useEffect } from "react";
import "./registrationUserData.js"
import { useState } from "react";
import bgimg from '../img/greenBackroundLoginPage.jpg'
import { createKeys } from '../../utils/Cryptography.jsx';
import { useAuth } from "../../hooks/AuthProvider.jsx";
import { useNotify } from "../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../hooks/Notification/NotificationTypes.tsx";

const RegistrationUserData = ({ userData, setSecrets, setUserData, nextStage }) => {
    let [formData, setFormData] = useState(userData);
    const userNameRegex = /^[a-zA-Z0-9]+$/
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    const auth = useAuth();
    const notify = useNotify();

    const checkUserData = (data) => {
        // TODO: check if username is already taken
        if (!emailRegex.test(data.email)) {
            notify.postNotification("Please enter a valid email", NotificationType.WARNING);
            return false;
        } else if (data.username.length < 4) {
            notify.postNotification("Username should contain at least 4 characters")
        } else if (!userNameRegex.test(data.username)) {
            notify.postNotification("Username can only contain letters and numbers", NotificationType.WARNING);
            return false;
        } else if (data.password.length < 8 || data.password.length > 128) {
            notify.postNotification("Password should contain at least 8 and at most 128 characters", NotificationType.WARNING);
            return false;
        } else if (!/[A-Z]/.test(data.password)) {
            notify.postNotification("Password should contain at least one uppercase letter", NotificationType.WARNING);
            return false;
        } else if (!/[a-z]/.test(data.password)) {
            notify.postNotification("Password should contain at least one lowercase letter", NotificationType.WARNING);
            return false;
        } else if (!/[0-9]/.test(data.password)) {
            notify.postNotification("Password should contain at least one number", NotificationType.WARNING);
            return false;
        } else if (data.password !== data.confirmPassword) {
            notify.postNotification("Passwords do not match", NotificationType.WARNING);
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        e.preventDefault();
        setFormData(formData => ({ ...formData, [e.target.name]: e.target.value }));

    };

    useEffect(() => {
        setUserData(formData);
    }, [formData, setUserData]);

    const handleNextStage = (e) => {
        e.preventDefault();
        if (checkUserData(formData)) {
            createKeys().then((data) => {
                setSecrets(data);
                auth.setKeyPair(data.keyPair);
                nextStage();
            });
        }
    }

    return (
        <div className="login-container">
            <div className="right-panel">
                <form className="login-form">
                    <h2 className="login-title">Registration</h2>
                    <p className="desc">It’s completely free</p>
                    <input type="text" placeholder="Username" className="login-input" name="username" value={formData.username} onChange={(e) => { handleChange(e) }} />
                    <input type="email" placeholder="Email" className="login-input" name="email" value={formData.email} onChange={(e) => { handleChange(e) }} />
                    <input type="password" placeholder="Password" className="login-input" name="password" onChange={handleChange} />
                    <input type="password" placeholder="Confirm Password" className="login-input" name="confirmPassword" onChange={handleChange} />
                    {/* TODO: add button state based on user data and readiness of secrets */}
                    <button type="submit" className="login-button" onClick={(e) => { handleNextStage(e) }}>
                        Create account
                    </button>
                    <p className="signup-link">
                        Already a member? <a href="/login">Sign in</a>
                    </p>
                </form>
            </div>
            <div className="left-panel left-panel-reg">
                <h1 className="logo-register">LOGO</h1>
                <div className="img-wrap">
                    <img src={bgimg} className="img-register-bg" alt="bg" />
                </div>
            </div>
        </div>
    );
};

export default RegistrationUserData;