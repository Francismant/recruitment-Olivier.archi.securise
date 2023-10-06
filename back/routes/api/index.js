const router = require("express").Router();
const apiUsers = require("./users");
const apiSkills = require("./skills");

router.use("/users", apiUsers);
router.use("/skills", apiSkills);

module.exports = router;
