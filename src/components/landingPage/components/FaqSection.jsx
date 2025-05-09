import React, { useState } from 'react';

const faqs = [
  {
    question: 'What platforms is the project supported on?',
    answer: 'The project is supported on Windows/Linux/MAC',
  },
  {
    question: 'Is there a mobile version available?',
    answer: 'Yes, a mobile version is currently under development.',
  },
  {
    question: 'How can I reset my password?',
    answer: 'Click "Forgot password" on the login screen and follow the instructions.',
  },
  {
    question: 'Can I use the service for free?',
    answer: 'Yes, there is a free plan with limited storage.',
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{open ? '▼' : '►'}</span> {question}
      </button>
      <div className={`faq-answer-wrapper ${open ? 'open' : ''}`}>
        <div className="faq-answer">{answer}</div>
      </div>
    </div>
  );
};

const FAQSection = () => (
  <section className="faq-section">
    <h2>FAQ</h2>
    <div className="faq-container">
      {faqs.map((faq, i) => (
        <FAQItem key={i} {...faq} />
      ))}
    </div>
    <div className="faq-footer">
      <p>Can't find the information you need? Send us an email</p>
      <span className="email">CloudStoragetestsupport@gmail.com</span>
    </div>
  </section>
);

export default FAQSection;