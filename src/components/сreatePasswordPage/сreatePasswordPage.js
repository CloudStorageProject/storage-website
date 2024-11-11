import React, { useState } from "react";
import "./сreatePasswordPage.css";

function CreatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="password-page">
      <div className="background-shapes"></div>
      <div className="password-box">
        <button className="back-button">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.302992 7.28284C-0.0930258 7.66779 -0.101996 8.30089 0.282956 8.69691L6.55612 15.1504C6.94107 15.5464 7.57417 15.5554 7.97019 15.1704C8.36621 14.7855 8.37518 14.1524 7.99022 13.7564L2.41408 8.01993L8.15051 2.44378C8.54653 2.05883 8.5555 1.42573 8.17055 1.02971C7.78559 0.633693 7.15249 0.624723 6.75648 1.00968L0.302992 7.28284ZM16.0127 7.2125L1.01418 6.99999L0.985842 8.99979L15.9843 9.2123L16.0127 7.2125Z"
              fill="#AEAEAE"
            />
          </svg>
        </button>
        <h2>Create New Password</h2>
        <p>Send your email account to reset password & make new password</p>
        <div className="input-container">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon">👁️</span>
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="eye-icon">👁️</span>
        </div>
        <button className="continue-button">Continue</button>
      </div>
    </div>
  );
}

export default CreatePasswordPage;
