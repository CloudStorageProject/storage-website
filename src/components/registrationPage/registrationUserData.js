import React from "react";
import "./registrationUserData.js"
import { useState } from "react";
import bgimg from '../img/greenBackroundLoginPage.jpg'

const RegistrationUserData = ({userData, setUserData, nextStage, previousStage}) => {
    const [formData, setFormData] = useState(userData);
  
    const handleChange = (e) => {
        if (e.target.name === "confirmPassword") {
            if (e.target.value !== formData.password) {
                // TODO: handle password mismatch
            }
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }


    return (
        <div className="login-container">
            <div className="right-panel">
                <form className="login-form">
                    <h2 className="login-title">Registration</h2>
                    <p className="desc">It’s completely free</p>
                    <input type="text" placeholder="Name" className="login-input" name="name" value={formData.name} onChange={handleChange} />
                    <input type="text" placeholder="Username" className="login-input" name="username" value={formData.useState} onChange={handleChange} />
                    <input type="email" placeholder="Email" className="login-input" name="email" value={formData.email} onChange={handleChange} />
                    <input type="password" placeholder="Password" className="login-input" name="password" onChange={handleChange} />
                    <input type="password" placeholder="Confirm Password" className="login-input" name="confirmPassword" onChange={handleChange} />
                    <button type="submit" className="login-button" onClick={nextStage}>
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