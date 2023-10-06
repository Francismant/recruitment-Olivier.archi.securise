const router = require("express").Router();
const bcrypt = require("bcrypt");

const connection = require("../../database/index");

module.exports = router;

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password, preference, skills } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const free = req.body.free === true ? "1" : "0";
  const sqlVerify = `SELECT *FROM candidates WHERE email=?`;

  connection.query(sqlVerify, [email], (err, result) => {
    if (err) throw err;
    if (result.length) {
      console.log("EMAIL EXISTANT");
      let isEmail = { message: "Email existant" };
      res.send(isEmail);
    } else {
      const sqlInsert =
        "INSERT INTO candidates (username, email, password, free, preference) VALUES (?,?,?,?,?)";
      const values = [username, email, hashedPassword, free, preference];
      connection.query(sqlInsert, values, (err, result) => {
        if (err) throw err;
        let idUser = result.insertId;
        console.log(idUser);
        skills.map((skill, index) => {
          let sqlSkill = `INSERT INTO user_skill (idSkill, idUser, level) VALUES (?,?,?)`;
          const valueSkill = [skill.value, idUser, skill.level];
          connection.query(sqlSkill, valueSkill, (err, result) => {
            if (err) throw err;
            console.log(result);
          });
        });
      });
      let isEmail = {
        messageGood: "Inscription réusie, vous allez être redirigé",
      };
      res.send(isEmail);
    }
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const sql = `SELECT idUser, username, password FROM candidates WHERE email=?`;
  connection.query(sql, [email], async (err, result) => {
    if (err) throw err;
    if (!result.length) {
      console.log("USER INCORRECT");
      let doesExist = { message: "Email et/ou mot de passe incorrect" };
      res.send(doesExist);
    } else {
      const dbPassword = result[0].password;
      const passwordMatch = await bcrypt.compare(password, dbPassword);
      if (!passwordMatch) {
        console.log("USER INCORRECT");
        let doesExist = { message: "Email et/ou mot de passe incorrect" };
        res.send(doesExist);
      } else {
        let idUser = result[0].idUser;
        const sqlData = `SELECT candidates.username, candidates.free, candidates.preference, candidates.email, skills.nameSkill,
            user_skill.level
            FROM candidates, skills, user_skill
            WHERE candidates.idUser = user_skill.idUser
            and user_skill.idSkill = skills.idSkill
            AND candidates.idUser = ?`;
        connection.query(sqlData, [idUser], (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(JSON.stringify(result));
        });
      }
    }
  });
});
