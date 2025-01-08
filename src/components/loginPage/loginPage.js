// src/components/LoginPage.js
import React from "react";
import "./loginPage.css"
import { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import bgimg from '../img/greenBackroundLoginPage.jpg'
import { Link } from "react-router-dom";

const LoginPage = ({ userData, setUserData, goToFullLogin }) => {
    const [formData, setFormData] = useState(userData);
    const auth = useAuth();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setUserData(formData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (auth.partialLoginAction(formData)) {
                // TODO: handle success
            } else {
                // TODO: handle failure
            }
        } catch (error) {
            console.log(error);
            // TODO: handle error
        }
    };

    return (
        <div className="login-container">
            <div className="left-panel">
                <div className="logo-main">
                    <h1 className="logo-login">LOGO</h1>
                </div>

                < div className="img-wrap" >
                    < img src={bgimg} className="img-login-bg" alt="bg" />
                </div>
            </div>
            <div className="right-panel">
                <form className="login-form">
                    <h2 className="login-title">Login</h2>
                    <input type="text" placeholder="Username" className="login-input" name="username" value={formData.username} onChange={handleInputChange} />
                    <input type="password" placeholder="Password" className="login-input" name="password" onChange={handleInputChange} />
                    <Link to="/reset-password" className="forgot-password">
                        Forgot password?
                    </Link>
                    <button type="submit" className="login-button" onClick={handleSubmit}>
                        Login
                    </button>
                    <button type="submit" className="login-button" onClick={goToFullLogin}>
                        FULL ACSESS LOGIN
                    </button>
                    <p className="signup-link">
                        Don’t have an account? <a href="/register">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
