const router = require("express").Router();

const connection = require("../../database/index");

module.exports = router;

// récupérer toutes les compétences pour le select dynamique dans le register
router.get("/getSkills", (req, res) => {
  try {
    const sql = "SELECT * FROM skills";
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } catch (error) {
    console.error(error);
  }
});

// récupérer toutes les compétences dans user_skill ainsi que le nombre de user qui ont ces compétences
router.get("/getNumberOfPersonBySkill", (req, res) => {
  try {
    const sql =
      "select nameSkill, count(user_skill.idSkill) as numberPerson from user_skill, skills WHERE user_skill.idSkill = skills.idSkill group by nameSkill order by numberPerson DESC";
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } catch (error) {
    console.error(error);
  }
});
