const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: String,
  content: String,
  user: {
    userid: String,
    upfp: String,
  },
  likes: Array,
  comments: [
    {
      comment: String,
      userid: String,
      upfp: String,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
