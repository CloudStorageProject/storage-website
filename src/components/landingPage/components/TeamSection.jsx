import React from 'react';
import team1 from '../../img/team/test.jpg'


const teamMembers = [
  { name: 'Олександр Гілязов', role: '', image: team1, isLead: true },
  { name: 'Сохацький Любомир', role: 'Backend Developer', image: team1 },
  { name: 'Загвойський Андрій', role: 'BA', image: team1 },
  { name: 'Михайло Гугляк', role: 'Project Manager', image: team1 },
  { name: 'Запотічний Святослав', role: 'DevOps', image: team1 },
  { name: 'Яночко Сергій', role: 'Frontend Developer', image: team1 },
  { name: 'Масляна Роман', role: 'Designer/Frontend', image: team1 },
  { name: 'Тимків Данил', role: 'QA', image: team1},
  { name: 'Давидів Володимир', role: 'Frontend Developer', image: team1 },
];

const TeamSection = () => (
  <section className="team-section">
    <h2>Our team</h2>
    <div className="team-container">
      {teamMembers.map((member, index) => (
        <div key={index} className={`team-member ${member.isLead ? 'lead' : ''}`}>
          <img src={member.image} alt={member.name} />
          <h3>{member.name}</h3>
          {member.role && <p>{member.role}</p>}
        </div>
      ))}
    </div>
  </section>
);

export default TeamSection;