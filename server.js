// Thư viện bên ngoài
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load biến môi trường
dotenv.config();

// Module nội bộ
const User = require("./models/user.model.js");
const Wishes = require("./models/wishes.model.js");

// Cấu hình app
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// create wishes
app.post("/api/create-wishes", async (req, res) => {
  const { name, content, hidden, time } = req.body;

  try {
    const wish = await Wishes.create({ name, content, hidden, time });
    res.status(201).json(wish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL wishes
app.get("/api/all-wishes", async (req, res) => {
  try {
    const wishes = await Wishes.find().sort({ createdAt: -1 });
    res.status(200).json(wishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create guest
app.post("/api/users", async (req, res) => {
  const { name, slug } = req.body;

  try {
    const existing = await User.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Slug đã tồn tại" });
    }

    const user = await User.create({ name, slug });
    res.status(201).json(user); // 201 là mã "Created"
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL GUEST
app.get("/api/all-guest", async (req, res) => {
  try {
    const users = await User.find(); // lấy tất cả user
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET GUEST BY SLUG
app.get("/api/all-guest/:slug", async (req, res) => {
  try {
    const { slug } = req.params; // Lấy slug từ URL

    // Tìm user theo slug
    const user = await User.findOne({ slug });

    if (!user) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching guest:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE GUEST BY ID
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TOGGLE hidden của một Wish
app.patch("/api/wishes/:id/toggle-hidden", async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy wish hiện tại
    const wish = await Wishes.findById(id);
    if (!wish) {
      return res.status(404).json({ message: "Wish not found" });
    }

    // Đảo trạng thái hidden
    wish.hidden = !wish.hidden;
    await wish.save();

    res.status(200).json({
      message: "Hidden toggled successfully",
      data: wish,
    });
  } catch (error) {
    console.error("Error toggling hidden:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE Wishes BY ID
app.delete("/api/wishes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const wishes = await Wishes.findByIdAndDelete(id);
    if (!wishes) {
      return res.status(404).json({ message: "Không tìm thấy lời chúc" });
    }
    res.status(200).json({ message: "Xóa thành công" });
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
