import React from "react";
import "./registrationPage.js"

const RegistrationPage = () => {
  return (
    <div className="login-container">
        <div className="right-panel">
        <form className="login-form">
          <h2 className="login-title">Registration</h2>
          <p className="desc">It’s completely free</p>
          <input type="text" placeholder="Name" className="login-input" />
          <input type="text" placeholder="Username" className="login-input" />
          <input type="email" placeholder="Email" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
          <input type="password" placeholder="Confirm Password" className="login-input" />
          <button type="submit" className="login-button">
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