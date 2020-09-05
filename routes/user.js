const express = require("express");
const {getUser,getAllUsers} = require("../controller/user");
const router = express.Router();
const {checkUserExists} = require("../middlewares/database/databaseErrorHelpers");
const {UserQueryMiddleware}= require("../middlewares/query/UserQueryMiddleware");
const userModel = require("../models/user");


router.get("/:id", checkUserExists,getUser);
router.get("/", UserQueryMiddleware(userModel),getAllUsers);







module.exports = router;


