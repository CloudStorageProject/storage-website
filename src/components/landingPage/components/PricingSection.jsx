import React, { useState } from 'react';

const plans = [
  {
    name: 'Lite',
    storage: '5gb',
    priceMonth: 5,
    priceYear: 50,
  },
  {
    name: 'Basic',
    storage: '15gb',
    priceMonth: 10,
    priceYear: 100,
  },
  {
    name: 'Pro',
    storage: '30gb',
    priceMonth: 15,
    priceYear: 150,
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2>Our plans</h2>
        <div className={`toggle ${!isYearly ? 'right' : ''}`}>
          <button
            className={`toggle-btn ${isYearly ? 'active' : ''}`}
            onClick={() => setIsYearly(true)}
          >
            Year
          </button>
          <button
            className={`toggle-btn ${!isYearly ? 'active' : ''}`}
            onClick={() => setIsYearly(false)}
          >
            Month
          </button>
        </div>

      </div>

      <div className="plan-cards">
        {plans.map((plan) => (
          <div className="card" key={plan.name}>
            <h3>{plan.name}</h3>
            <p>Some description of plan bla bla bla bla</p>
            <div className="circle"><span>{plan.storage}</span></div>
            <p className="price">
              {isYearly ? `${plan.priceYear}$ per year` : `${plan.priceMonth}$ per month`}
            </p>
            <div className="arrow">→</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;