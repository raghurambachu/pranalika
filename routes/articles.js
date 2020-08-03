const express = require("express");
const quillParser = require("../utils/quill-to-html");
const Article = require("../models/Article");

const auth = require("../middlewares/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/", auth.verifyUserLoggedIn, (req, res, next) => {
  res.render("index");
});

router.get("/list", auth.verifyUserLoggedIn, (req, res, next) => {
  Article.find({ author: req.user._id }, "-updatedAt", (err, articles) => {
    if (err) return next(err);
    res.render("list-articles", { articles });
  });
});

router.post("/", auth.verifyUserLoggedIn, async (req, res, next) => {
  const markup = await quillParser.quillToHtmlParser(
    req.body.article.description
  );

  const article = {
    title: req.body.article.title,
    description: markup,
    author: req.user._id,
    readTime: 5,
  };

  Article.create(article, (err, article) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      req.user._id,
      { $push: { articleAuthored: article._id } },
      (err, updatedUser) => {
        if (err) return next(err);
        res.redirect("/articles/list");
      }
    );
  });
});

router.get("/new", auth.verifyUserLoggedIn, (req, res, next) => {
  res.render("article-create");
});

router.get("/:id/delete", auth.verifyUserLoggedIn, (req, res, next) => {
  const articleId = req.params.id;
  Article.findById(articleId, (err, article) => {
    if (err) return next(err);

    if (req.user._id.toString() === article.author.toString()) {
      Article.findByIdAndDelete(articleId, (err, deletedArticle) => {
        if (err) return next(err);
        User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { articleAuthored: articleId },
          },
          (err, updatedArticle) => {
            if (err) return next(err);
            res.redirect("/articles/list");
          }
        );
      });
    } else {
      res.redirect("/articles/list");
    }
  });
});

module.exports = router;
