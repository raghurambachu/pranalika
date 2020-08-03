const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

/* GET home page. */
router.get("/", auth.verifyUserLoggedIn, function (req, res, next) {
  res.redirect("/articles");
});

module.exports = router;
