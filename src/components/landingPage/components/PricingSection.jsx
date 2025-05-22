import { useEffect, useState } from 'react';
import { getPayments } from '../../../service/SettingsService';
import { PlanStructure } from '../../../utils/Structures.tsx';


const PricingSection = () => {
    const [isYearly, setIsYearly] = useState(false);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        getPayments().then((response) => {
            console.log(response);

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
                <div className={`toggle ${!isYearly ? 'right' : ''}`}>
                    <button className={`toggle-btn ${!isYearly ? 'active' : ''}`} onClick={() => setIsYearly(false)} > Month </button>
                    <button className={`toggle-btn ${isYearly ? 'active' : ''}`} onClick={() => setIsYearly(true)} > Year </button>
                </div>
            </div>

            <div className="plan-cards">
                {plans.map((plan) => (
                    <div className="card" key={plan.name}>
                        <h3>{plan.name}</h3>
                        <p>Some description of plan bla bla bla bla</p>
                        <div className="circle"><span>{plan.space}</span></div>
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