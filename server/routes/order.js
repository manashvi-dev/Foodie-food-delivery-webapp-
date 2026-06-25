const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const order = require("../controller/order");
const {validateOrder} = require("../middleware/validate");


router.post("/",auth,role("customer"),validateOrder,wrapAsync(order.placeorder));

router.get("/restaurant",auth,role("restaurant"),wrapAsync(order.restaurantorders));

router.get("/agent/allOrders",auth,role("agent"),wrapAsync(order.agentorders));

router.get("/myorders",auth,role("customer"),wrapAsync(order.myorders));

router.get("/:orderid",auth,role("customer"),wrapAsync(order.getorder));

router.get("/:orderid/status",auth,role("customer"),wrapAsync(order.orderstatus));

router.patch("/:orderid",auth,role("customer"),wrapAsync(order.cancel));



router.patch("/:orderid/status",auth,role("restaurant","agent"),wrapAsync(order.updatestatus));







module.exports = router;