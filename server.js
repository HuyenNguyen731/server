// 1. Thư viện bên ngoài
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// 2. Load biến môi trường
dotenv.config();

// 3. Module nội bộ
const User = require("./models/user.model.js");

// 4. Cấu hình app
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 5. route api
app.get("/api/home", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/api/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route GET ALL USERS
app.get("/api/all-guest", async (req, res) => {
  try {
    const users = await User.find(); // lấy tất cả user
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    `mongodb+srv://nguyenthuhuyen731:${process.env.MONGO_DB}@backendwedding.iz4yagx.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendWedding`
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(port, () => {
      console.log(`Server started on port ${port} `);
    });
  })
  .catch(() => {
    console.log("Connection fail!");
  });
