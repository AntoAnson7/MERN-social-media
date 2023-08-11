const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

//Routes
const authRoutes = require("./Routes/authRoutes");
const postRoutes = require("./Routes/postRoutes");

//Middlewares
const authenticateToken = require("./Middlewares/authToken");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.get("/api/current", authenticateToken, (req, res) => {
  res.json({ access: true, user: req.user });
});

app.listen(5000, () => {
  console.log("Server started at PORT 5000");
});
