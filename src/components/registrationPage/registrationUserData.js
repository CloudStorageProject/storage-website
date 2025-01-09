import React, { useEffect } from "react";
import "./registrationUserData.js"
import { useState } from "react";
import bgimg from '../img/greenBackroundLoginPage.jpg'
import { createKeys } from '../../utils/Cryptography.jsx';

const RegistrationUserData = ({ userData, setSecrets, setUserData, nextStage }) => {
    let [formData, setFormData] = useState(userData);
    let [canProceed, setCanProceed] = useState(false);
    const userNameRegex = /^[a-zA-Z0-9]+$/

    const checkUserData = (data) => {
        if (!userNameRegex.test(data.username)) {
            return false;
            // TODO: Handle username error
        } else if (data.password.length < 8 || data.password.length > 128) {
            return false;
            // TODO: Handle password error
        } else if (data.password !== data.confirmPassword) {
            return false;
            // TODO: Handle password mismatch
        }
        return true;
    }

    const handleChange = (e) => {
        e.preventDefault();
        setFormData(formData => ({ ...formData, [e.target.name]: e.target.value }));
        checkUserData(formData);
    };

    useEffect(() => {
        setUserData(formData);
        setCanProceed(checkUserData(formData));
    }, [formData, setUserData]);

    const handleNextStage = () => {
        setSecrets(createKeys());
        nextStage();
    }

    return (
        <div className="login-container">
            <div className="right-panel">
                <form className="login-form">
                    <h2 className="login-title">Registration</h2>
                    <p className="desc">It’s completely free</p>
                    <input type="text" placeholder="Name" className="login-input" name="name" value={formData.name} onChange={(e) => { handleChange(e) }} />
                    <input type="text" placeholder="Username" className="login-input" name="username" value={formData.username} onChange={(e) => { handleChange(e) }} />
                    <input type="email" placeholder="Email" className="login-input" name="email" value={formData.email} onChange={(e) => { handleChange(e) }} />
                    <input type="password" placeholder="Password" className="login-input" name="password" onChange={handleChange} />
                    <input type="password" placeholder="Confirm Password" className="login-input" name="confirmPassword" onChange={handleChange} />
                    {/* TODO: add button state based on user data and readiness of secrets */}
                    <button type="submit" className="login-button" disabled={!canProceed} onClick={handleNextStage}>
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