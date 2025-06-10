import { useEffect, useState } from 'react';
import { getPayments } from '../../../service/SettingsService';
import { PlanStructure } from '../../../utils/Structures.tsx';


const PricingSection = () => {
    const [isYearly, setIsYearly] = useState(false);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        getPayments().then((response) => {
            var tmp = [];
            for (let i = 0; i < response.data.length; i++) {
                const el = response.data[i];
                tmp.push(new PlanStructure(el.name, el.space, el.price, el.description, el.price, el.price * 12));
            }
            setPlans(tmp);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <section className="pricing-section">
            <div className="pricing-header">
                <h2>Our plans</h2>
                <div className={`toggle ${isYearly ? 'right' : ''}`}>
                    <button className={`toggle-btn ${!isYearly ? 'active' : ''}`} onClick={() => setIsYearly(false)} > Month </button>
                    <button className={`toggle-btn ${isYearly ? 'active' : ''}`} onClick={() => setIsYearly(true)} > Year </button>
                </div>
            </div>

            <div className="plan-cards">
                {plans.map((plan) => (
                    <div
                        className="card"
                        key={plan.name}
                        onClick={() => { window.location.href = "/register" }}
                        style={{ cursor: "pointer" }}
                    >
                        <h3>{plan.name}</h3>
                        <p>{plan.description}</p>
                        <div className="circle"><span>{plan.space}</span></div>
                        <p className="price">
                            {isYearly ? `${plan.priceYear.toFixed(2)}$ per year` : `${plan.priceMonth.toFixed(2)}$ per month`}
                        </p>
                        <div className="arrow">→</div>
                    </div>
                ))}
            </div>

        </section>
    );
};

export default PricingSection;