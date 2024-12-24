import React, { useEffect } from "react";
import "./registrationUserData.js"
import { useState } from "react";
import bgimg from '../img/greenBackroundLoginPage.jpg'

const RegistrationUserData = ({userData, setUserData, nextStage}) => {
    let [formData, setFormData] = useState(userData);
    const userNameRegex = /^[a-zA-Z0-9]+$/
    
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.name === "confirmPassword" && (e.target.value !== userData.password)) {
            // TODO: handle password mismatch
        }else if (e.target.name === "username" && !userNameRegex.test(e.target.value)) {
            // TODO: handle invalid username
        } else if (e.target.name === "password" && (e.target.value.length < 8 || e.target.value.length > 128)  ) {
            // TODO: handle password length
        }
        setFormData(formData => ({ ...formData, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        setUserData(formData);
    }, [formData]);


    return (
        <div className="login-container">
            <div className="right-panel">
                <form className="login-form">
                    <h2 className="login-title">Registration</h2>
                    <p className="desc">It’s completely free</p>
                    <input type="text" placeholder="Name" className="login-input" name="name" value={formData.name} onChange={(e)=>{handleChange(e)}} />
                    <input type="text" placeholder="Username" className="login-input" name="username" value={formData.username} onChange={(e)=>{handleChange(e)}} />
                    <input type="email" placeholder="Email" className="login-input" name="email" value={formData.email} onChange={(e)=>{handleChange(e)}} />
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