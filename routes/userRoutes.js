const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ─────────────────────────────────────────
// CREATE — POST /api/users
// ─────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, walletBalance } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({ name, email, phone, walletBalance });
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// READ ALL — GET /api/users
// ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Users fetched successfully", count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// READ ONE — GET /api/users/:id
// ─────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// UPDATE — PUT /api/users/:id
// ─────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE — DELETE /api/users/:id
// ─────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;