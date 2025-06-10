import React from 'react';
import { ReactComponent as Lock } from '../../img/Lock.svg';
import { ReactComponent as Upload } from '../../img/Upload.svg';

const AboutSection = () => (
  <section className="about-section">
    <h2>About Project</h2>
    <div className="about-cards">
      <div className="about-card">
        <div className="icon"><Lock /></div>
        <h3>Store and protect<br />your files</h3>
        <p>Safely store and protect your files with advanced encryption, ensuring only you have access to your data.</p>
      </div>
      <div className="about-card">
        <div className="icon"><Upload /></div>
        <h3>Share content</h3>
        <p>Easily share content with trusted individuals while maintaining full control over your privacy and security.</p>
      </div>
    </div>
  </section>
);

export default AboutSection;