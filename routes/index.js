const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Article = require("../models/Article");

/* GET home page. */
router.get("/", function (req, res, next) {
  Article.find()
    .populate("author", "_id username")
    .exec((err, articles) => {
      res.render("index", { articles });
    });
});

module.exports = router;
