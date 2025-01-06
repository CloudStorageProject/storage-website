import React, { useState } from 'react';
import './resetPassword.css';

import leftArrow from '../img/Arrow 2.svg';

const ResetPassword = ({ userData, setUserData, nextStage, previousStage }) => {
    let [data, setData] = useState(userData.email);

    const handleChange = (e) => {
        e.preventDefault();
        setData(e.target.value);
        setUserData({ ...userData, email: e.target.value });
    };

    return (
        <div className="container">
            {/* Лівий і правий нахилені квадрати */}
            <div className="background-left"></div>
            <div className="background-right"></div>

            <div className="card">
                <img className='backButton' onClick={previousStage} src={leftArrow}></img>
                <h2 className="title">Reset Your Password</h2>
                <p className="subtitle">Please enter your email to reset the password</p>

                <label htmlFor="email" className="label">Email</label>
                <input id="email" type="email" className="input" value={data} onChange={handleChange} />

                <p className="infoText">Code was sent to your email <br /><span className="email">example@gmail.com</span></p>

                <button className="continueButton" onClick={nextStage}>Continue</button>
            </div>
        </div>
    );
};

export default ResetPassword;
