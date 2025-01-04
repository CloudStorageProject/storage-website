import React from 'react';
import './verifyPage.css';
import { Link } from 'react-router-dom';

const VerifyPage = () => {
  return (
    <div className="verify-container">
      {/* Лівий і правий нахилені квадрати */}
      <div className="background-left-verification"></div>
      <div className="background-right-verification"></div>

      <div className="card">
        <Link to="/login" className="backButton">
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.302992 7.28296C-0.0930258 7.66791 -0.101996 8.30101 0.282956 8.69703L6.55612 15.1505C6.94107 15.5465 7.57417 15.5555 7.97019 15.1705C8.36621 14.7856 8.37518 14.1525 7.99022 13.7565L2.41408 8.02005L8.15051 2.4439C8.54653 2.05895 8.5555 1.42585 8.17055 1.02983C7.78559 0.633815 7.15249 0.624845 6.75648 1.0098L0.302992 7.28296ZM16.0127 7.21262L1.01418 7.00011L0.985842 8.99991L15.9843 9.21242L16.0127 7.21262Z" fill="#AEAEAE"/>
          </svg>
        </Link>
        <h2 className="title">Verify Code</h2>
        <p className="subtitle">Please enter the code we just sent to email</p>
        <p className="email">example@gmail.com</p>

        <div className="code-inputs">
          <input type="text" maxLength="1" className="code-input" />
          <input type="text" maxLength="1" className="code-input" />
          <input type="text" maxLength="1" className="code-input" />
          <input type="text" maxLength="1" className="code-input" />
        </div>

        <p className="resend-text">
          Didn’t get the code? <a href="#" className="resend-link">Resend code</a>
        </p>

        <button className="verify-button">Verify</button>
      </div>
    </div>
  );
};

export default VerifyPage;
