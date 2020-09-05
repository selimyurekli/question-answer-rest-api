const express = require("express");
const {getAdminAccess,getAccessToRoute} = require("../middlewares/authorization/auth");
const {block,unblock,deleteUser} = require("../controller/admin");
const router = express.Router();
const {checkUserExists} = require("../middlewares/database/databaseErrorHelpers");

router.use([getAccessToRoute,getAdminAccess]);
router.get("/block/:id",checkUserExists,block);
router.get("/unblock/:id",checkUserExists,unblock);
router.delete("/delete/:id",checkUserExists,deleteUser);


module.exports = router;