import React from 'react';
import { ReactComponent as Logo } from '../../img/Logo.svg';
import { ReactComponent as Ipad } from '../../img/Ipad.svg';

const HeroSection = () => (
  <section className="hero-section">
    <div className="button-container">
      <button className="btn" onClick={() => { window.location.href = "/login" }}>Login</button>
      <button className="btn" onClick={() => { window.location.href = "/register" }}>Registration</button>
    </div>
    <div className="container-main">
      <div className="info-div">
        <Logo />
        <h1>Cloud Storage</h1>
        <p>
        Store your files securely and share them with friends in one click!
        </p>
        <button className="btn-free">Try For Free</button>
      </div>
      <div className="info-div">
        <Ipad />
      </div>
    </div>
  </section>
);

export default HeroSection;