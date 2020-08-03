const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Article",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
