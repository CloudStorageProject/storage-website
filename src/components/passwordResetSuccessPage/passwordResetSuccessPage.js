import React from 'react';
import './passwordResetSuccessPage.css';

function PasswordResetSuccessPage() {
  return (
    <div className="success-page">
      <div className="background-shapes"></div>
      <div className="success-box">
        <div className="success-icon">✔</div>
        <h2>Password Successfully Reset</h2>
        <p>Please check your email and log in to your account.</p>
        <button className="login-button">Login Now</button>
      </div>
    </div>
  );
}

export default PasswordResetSuccessPage;
