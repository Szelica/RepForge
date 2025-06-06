const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        fitnessLevel: newUser.fitnessLevel,
        height: newUser.height,
        weight: newUser.weight,
        workoutStyle: newUser.workoutStyle,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        fitnessLevel: user.fitnessLevel,
        height: user.height,
        weight: user.weight,
        workoutStyle: user.workoutStyle,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET USERS (without passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch users" });
  }
});

// UPDATE PROFILE
router.put("/profile/:id", async (req, res) => {
  const allowedFields = [
    "name",
    "email",
    "fitnessLevel",
    "height",
    "weight",
    "workoutStyle",
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Profile update error:", err.message);
    res.status(500).json({ error: "Error updating profile" });
  }
});

module.exports = router;
