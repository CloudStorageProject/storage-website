import React from 'react';
import './verifyPage.css';
import leftArrow from '../img/Arrow 2.svg';

const VerifyPage = ({ userData, setUserData, nextStage, previousStage }) => {
    return (
        <div className="verify-container">
            {/* Лівий і правий нахилені квадрати */}
            <div className="background-left-verification"></div>
            <div className="background-right-verification"></div>

            <div className="card">
                <img className='backButton' onClick={previousStage} src={leftArrow}></img>

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

                <button className="verify-button" onClick={nextStage}>Verify</button>
            </div>
        </div>
    );
};

export default VerifyPage;
