const express = require("express");
const router = express.Router();
const controller = require("../controllers/control");
const val = require("../Middleware/vadilate");


router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/getdata", controller.getdata);
router.post("/createdata", controller.createdata);
router.get("/datalist", controller.selectData);
/**
 * @swagger 
 * /:
 *  get:
 *      summary: This is for get route
 *      description: This is for get route
 *      responses:
 *          200:
 *      description:To test Get method
 */
router.get("/profile", val, controller.profile);

module.exports = router;
