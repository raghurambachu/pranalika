const express = require("express");
const Comment = require("../models/Comment");
const auth = require("../middlewares/auth");
const Article = require("../models/Article");
const User = require("../models/User");

const router = express.Router();

router.get("/:id/delete", auth.verifyUserLoggedIn, (req, res, next) => {
  const commentId = req.params.id;
  Comment.findOne({ _id: commentId })
    .populate("userId", "_id")
    .exec((err, comment) => {
      if (err) return next(err);
      if (req.user._id.toString() === comment.userId._id.toString()) {
        Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
          if (err) return next(err);
          Article.findByIdAndUpdate(
            comment.articleId,
            { $pull: { comments: comment._id } },
            (err, deletedCommentId) => {
              if (err) return next(err);
              User.findByIdAndUpdate(
                comment.userId._id,
                { $pull: { comments: comment._id } },
                (err, deletedCommentId) => {
                  if (err) return next(err);
                  res.redirect(`/articles/${comment.articleId}`);
                }
              );
            }
          );
        });
      }
    });
});

module.exports = router;
