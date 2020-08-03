var express = require("express");

const userController = require("../controller/userController");
const router = express.Router();
const auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/login", userController.getLoginOrRegisterPage);

router.get("/register", userController.getLoginOrRegisterPage);

router.post("/new", userController.createUser);

router.post("/login", userController.logUserIn);

router.get("/logout", auth.verifyUserLoggedIn, userController.logOutUser);

module.exports = router;
