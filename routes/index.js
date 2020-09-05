const express = require("express");
const questions = require("./questions");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");
const answers = require("./answers");
const router = express.Router();

router.use("/questions",questions);
router.use("/auth",auth);
router.use("/users",user);
router.use("/admin",admin);
router.use("/answers",answers);






module.exports = router ;




