const express = require("express");
const router = express.Router({ mergeParams: true });
const {usersignup,userlogin,userDetail} = require("../controller/user");
const wrapAsync = require('../utils/wrapAsync');
const auth = require("../middleware/auth");
const {validateUser} = require("../middleware/validate");

router.post("/signup",validateUser,wrapAsync(usersignup));

router.post("/login",wrapAsync(userlogin));

router.get("/auth/me",auth,wrapAsync(userDetail));


module.exports = router;