const express = require("express");
const router = express.Router({ mergeParams: true });
const {storage} = require("../config/cloudy");
const multer = require("multer");
const upload = multer({storage});
const wrapAsync = require("../utils/wrapAsync");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const restaurant = require("../controller/restaurant");
const {validateRestaurant} = require("../middleware/validate");

router.get("/",wrapAsync(restaurant.getAllRestaurant));

router.get("/mine",auth,role("restaurant"),wrapAsync(restaurant.myrestaurant));


router.post("/new",auth,role("restaurant"),upload.single("image"),validateRestaurant,wrapAsync(restaurant.createRestaurant));

router.get("/:id",wrapAsync(restaurant.getRestaurant));

router.patch("/edit/:id",auth,role("restaurant"),upload.single("image"),validateRestaurant,wrapAsync(restaurant.updateRestaurant));

router.delete("/:id",auth,role("restaurant"),wrapAsync(restaurant.deleteRestaurant));

router.post("/:id/rate",auth,role("customer"),wrapAsync(restaurant.rateRestaurant));

module.exports = router;
