import React from "react";
import "./registrationPage.js"
import { register, signOut } from "../../service/authService";
import { useState } from "react";
import useSignIn from 'react-auth-kit/hooks/useSignIn'

const RegistrationPage = () => {
    const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
    const signIn = useSignIn();
    const handleChange = (e) => {
        if (e.target.name === "confirmPassword") {
            if (e.target.value !== formData.password) {
                // TODO: handle password mismatch
            }
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            email: formData.email,
            username: formData.username,
            password: formData.password,
        }
        try {
            const response = await register(data);
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
                    <button type="submit" className="login-button" onClick={handleSubmit}>
                        Create account
                    </button>
                    <p className="signup-link">
                        Already a member? <a href="#">Sign in</a>
                    </p>
                </form>
            </div>
            <div className="left-panel">
                <h1 className="logo">LOGO</h1>
            </div>
        </div>
    );
};

export default RegistrationPage;