const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../mongo/models/userModel");

function getRandomNumber() {
  return Math.floor(Math.random() * 500 + 100);
}

router.post("/login", (req, res) => {
  const uname = req.body.name;
  const pwd = req.body.pwd;

  User.findOne({ username: uname })
    .then((data) => {
      if (data) {
        if (data.password == pwd) {
          const _user = { id: uname };
          const accessToken = jwt.sign(_user, process.env.ACCESS_TOKEN_SECRET);

          return res.status(200).json({ user: data, accessToken: accessToken });
        }
        res.status(401).json({ msg: "Wrong password" });
      } else {
        return res.status(401).json({ msg: "User does not exist" });
      }
    })
    .catch((err) => console.log(err));
});

router.post("/signup", (req, res) => {
  const user = {
    _id: "@" + req.body.username + getRandomNumber(),
    username: req.body.username,
    password: req.body.password,
    pfp: req.body.pfp,
    email: req.body.email,
    liked: [],
  };

  User.create(user)
    .then((data) => {
      console.log(data);
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Signup failed" });
    });
});

module.exports = router;
