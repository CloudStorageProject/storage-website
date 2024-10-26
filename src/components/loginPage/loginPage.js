// src/components/LoginPage.js
import React from "react";
import "./loginPage.css"

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="left-panel">
        <h1 className="logo">LOGO</h1>
      </div>
      <div className="right-panel">
        <form className="login-form">
          <h2 className="login-title">Login</h2>
          <input type="text" placeholder="Username" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="signup-link">
            Don’t have an account? <a href="#">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
