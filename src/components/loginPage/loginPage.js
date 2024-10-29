// src/components/LoginPage.js
import React from "react";
import "./loginPage.css"
import { useState } from "react";
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import { login } from "../../service/authService";
import bgimg from '../img/greenBackroundLoginPage.jpg'


const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const signIn = useSignIn()

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: formData.username,
            password: formData.password,
        }
        try {
            const response = await login(data);
            if (signIn({
                auth: {
                    token: response.auth.token,
                    type: response.auth.type,
                },
                userState: response.userState
            })) {
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
                <h1 className="logo">LOGO</h1>
            </div>

            <div className="img-wrap">
                <div className="img-wraped">
                    <img src={bgimg} alt="bg"/>
                </div>
            </div>
            </div>
            <div className="right-panel">
                <form className="login-form">
                    <h2 className="login-title">Login</h2>
                    <input type="text" placeholder="Username" className="login-input" name="username" value={formData.username} onChange={handleInputChange} />
                    <input type="password" placeholder="Password" className="login-input" name="password" onChange={handleInputChange} />
                    <a href="#" className="forgot-password">
                        Forgot password?
                    </a>
                    <button type="submit" className="login-button" onClick={handleSubmit}>
                        Login
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
