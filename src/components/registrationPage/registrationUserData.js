import React, { useEffect } from "react";
import "./registrationUserData.js"
import { useState } from "react";
import bgimg from '../img/greenBackroundLoginPage.jpg'
import { createKeys } from '../../utils/Cryptography.jsx';
import { useAuth } from "../../hooks/AuthProvider.jsx";
import { useNotify } from "../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../hooks/Notification/NotificationTypes.tsx";
import { testEmailTaken, testUserData, testUsernameTaken } from "../../utils/InputValidations.tsx";

const RegistrationUserData = ({ userData, setSecrets, setUserData, nextStage }) => {
    let [formData, setFormData] = useState({ ...userData, password: "", confirmPassword: "" });
    const auth = useAuth();
    const notify = useNotify();

    const checkUserData = async (data) => {
        try {
            await testUserData(data.username, data.password, data.email);
            if (data.password !== data.confirmPassword) {
                notify.postNotification("Passwords do not match", NotificationType.WARNING);
                return false;
            }
            await testUsernameTaken(data.username);
            await testEmailTaken(data.email);
            return true;
        } catch (error) {
            notify.postNotification(error.message, NotificationType.ERROR);
            return false;
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setFormData(formData => ({ ...formData, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        setUserData(formData);
    }, [formData, setUserData]);

    const handleNextStage = async (e) => {
        e.preventDefault();
        if (await checkUserData(formData)) {
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
                    <input type="password" placeholder="Password" className="login-input" name="password" onChange={(e) => { handleChange(e); }} />
                    <input type="password" placeholder="Confirm Password" className="login-input" name="confirmPassword" onChange={(e) => { handleChange(e); }} />
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