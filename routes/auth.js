const express  = require("express");
const {register,login,logout,getUser,imageUpload,forgotpassword,resetPassword,editProfile} = require("../controller/auth")
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const router = express.Router();
var multer  = require('multer')
const profileImageUpload = require("../middlewares/libraries/profileImageUpload")
router.post("/register",register);
router.post("/login", login);
router.get("/logout", getAccessToRoute,logout);
router.get("/profile",getAccessToRoute,getUser);
router.post("/update", [getAccessToRoute,profileImageUpload.single("profile_image")],imageUpload);
router.post("/forgotpassword",forgotpassword);
router.put("/resetpassword",resetPassword);
router.put("/edit", getAccessToRoute,editProfile);


module.exports = router;
