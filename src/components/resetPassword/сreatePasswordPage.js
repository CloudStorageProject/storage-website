import React, { useState } from "react";
import "./сreatePasswordPage.css";
import leftArrow from '../img/Arrow 2.svg';
import eye_open from '../img/Eye-Open.svg';
import eye_closed from '../img/Eye-crossed.svg';

function CreatePasswordPage({ userData, setUserData, nextStage, previousStage }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Контроль видимості пароля
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    return (
        <div className="password-page">
            <div className="background-shapes"></div>
            <div className="password-box">
                <img className='backButton' onClick={previousStage} src={leftArrow}></img>

                <h2>Create New Password</h2>
                <p>Send your email account to reset password & make new password</p>
                <div className="input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span onClick={togglePasswordVisibility} className="eye-icon">
                        <img src={showPassword ? eye_open : eye_closed}></img>
                    </span>
                </div>
                <div className="input-container">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span onClick={toggleConfirmPasswordVisibility} className="eye-icon">
                        <img src={showConfirmPassword ? eye_open : eye_closed}></img>
                    </span>
                </div>
                <button className="continue-button" onClick={nextStage}>Continue</button>
            </div>
        </div>
    );
}

export default CreatePasswordPage;
