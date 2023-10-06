import { useEffect, useState } from "react";
import styles from "./Homepage.module.scss";

export default function Homepage() {
  const [skillsWithNumberOfPerson, setSkillsWithNumberOfPerson] = useState([]);

  useEffect(() => {
    async function getNumberOfSkills() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/skills/getNumberOfPersonBySkill"
        );
        if (response.ok) {
          const skillsByPerson = await response.json();
          // console.log(skillsByPerson);
          setSkillsWithNumberOfPerson(skillsByPerson);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getNumberOfSkills();
  }, []);

  return (
    <div className="flex-fill">
      <h1>Homepage</h1>
      <ul className="d-flex flex-column align-items-center justify-content-center">
        {skillsWithNumberOfPerson.map((skill, i) => (
          <li key={i} className={`mb20`}>
            <span className={`${styles.name}`}>{skill.nameSkill}</span>
            <span className={`${styles.number}`}>({skill.numberPerson})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
