import React from 'react';
import './LandingPage.css'
import PricingSection from './components/PricingSection';
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import FAQSection from './components/FaqSection';
import Footer from './components/Footer';



const LandingPage = () => {
  return (
    <div>
<HeroSection />
<AboutSection />
<PricingSection />
<TeamSection />
<FAQSection />
<Footer />
    </div>
  );
};

export default LandingPage;