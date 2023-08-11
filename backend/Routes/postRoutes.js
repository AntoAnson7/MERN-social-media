const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = require("../mongo/models/postModel");
const User = require("../mongo/models/userModel");

const authenticateToken = require("../Middlewares/authToken");

// Create a new post
router.post("/create", authenticateToken, async (req, res) => {
  const { content, userid } = req.body;

  const user = await User.findOne({ _id: userid });

  const post = {
    _id: userid + Date.now().toString(),
    content: content,
    user: {
      userid: userid,
      upfp: user.pfp,
    },
    likes: [],
    comments: [],
  };

  Post.create(post)
    .then((data) => {
      console.log(`Post "${data._id}" created successfully!`);
      return res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Post creation failed" });
    });
});

// Get all posts
router.get("/all", (req, res) => {
  Post.find()
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Cant get posts" });
    });
});

// Get a post by post id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  Post.find({ _id: id })
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Cant get posts" });
    });
});

// Get all posts by userid
router.get("/user/:userid", (req, res) => {
  const { userid } = req.params;

  Post.find({ userid: userid })
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Cant get posts" });
    });
});

// Like a post
router.post("/like/:pid/:uid", authenticateToken, (req, res) => {
  const post = req.params.pid;
  const user = req.params.uid;

  User.findOne({ _id: user })
    .then((data) => {
      if (data != null) {
        Post.findOne({ _id: post }).then((data) => {
          let temp = data.likes.filter((t) => t == user);
          if (temp.length == 0) {
            Post.updateOne({ _id: post }, { $push: { likes: user } })
              .then((data) => {
                console.log("Post updated");
                User.updateOne({ _id: user }, { $push: { liked: post } })
                  .then((data) => {
                    console.log("User Updated");
                  })
                  .catch((err) => {
                    console.log(err);
                    return res
                      .status(400)
                      .json({ msg: "Cant update user likes" });
                  });
                return res.status(200).json(data);
              })
              .catch((err) => {
                res.status(400).json({ msg: "Cant like post" });
                console.log(err);
              });
          } else {
            return res
              .status(400)
              .json({ msg: "user already liked this post" });
          }
        });
      } else {
        throw console.error();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Cant find user!" });
    });
});

// Comment on a post
router.put("/comment/:pid/:uid", authenticateToken, async (req, res) => {
  const postid = req.params.pid;
  const userid = req.params.uid;
  const { comment } = req.body;

  try {
    const user = await User.findById(userid);

    if (!user) {
      return res.status(400).json({ msg: "Invalid user or user not found" });
    }

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(400).json({ msg: "Invalid post or post not found" });
    }

    const newComment = {
      comment: comment,
      userid: userid,
      upfp: user.pfp,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error adding comment" });
  }
});

// Delete a post
router.delete("/delete/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  Post.findOne({ _id: id })
    .then((data) => {
      if (data.userid == req.user.id) {
        Post.deleteOne({ _id: id })
          .then((data) => {
            console.log("Post deleted successfully");
            return res.status(201).json(data);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: "Cant delete post" });
          });
      } else {
        return res.status(400).json({ msg: "only owner can delete a post" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ msg: "Cant find post" });
    });
});

module.exports = router;
// Anto1690608848352
