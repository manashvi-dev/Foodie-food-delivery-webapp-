const Menu = require("../models/menu");
const express = require("express");
const router = express.Router({ mergeParams: true });
const {storage} = require("../config/cloudy");
const multer = require("multer");
const upload = multer({storage});
const wrapAsync = require("../utils/wrapAsync");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const menu = require("../controller/menu");
const {validateMenu}  = require("../middleware/validate");


router.get("/",wrapAsync(menu.getMenu));

router.post("/addItem",auth,role("restaurant"),upload.single("image"),validateMenu,wrapAsync(menu.addMenuItem));

router.put("/:itemId",auth,role("restaurant"),upload.single("image"),wrapAsync(menu.updateMenuItem));

router.delete("/:itemId",auth,role("restaurant"),wrapAsync(menu.deleteMenuItem));


module.exports = router;