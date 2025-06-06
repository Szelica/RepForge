// src/backend/routes/exerciseRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Exercise = require("../models/exercise");

function validateExerciseInput(data) {
  const errors = [];

  if (
    !data.exerciseName ||
    typeof data.exerciseName !== "string" ||
    data.exerciseName.trim().length < 3
  ) {
    errors.push("Exercise name must be at least 3 characters long.");
  }

  if (
    !Array.isArray(data.exerciseMuscleType) ||
    data.exerciseMuscleType.length === 0
  ) {
    errors.push("At least one muscle group must be selected.");
  }

  if (!Array.isArray(data.exerciseType) || data.exerciseType.length === 0) {
    errors.push("At least one exercise type must be selected.");
  }

  const allowedLevels = ["Beginner", "Intermediate", "Advanced"];
  if (!data.exerciseLevel || !allowedLevels.includes(data.exerciseLevel)) {
    errors.push("Invalid difficulty level.");
  }

  if (!data.userId || !mongoose.Types.ObjectId.isValid(data.userId)) {
    errors.push("Invalid or missing user ID.");
  }

  return errors;
}

// CREATE exercise
router.post("/create", async (req, res) => {
  const errors = validateExerciseInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const {
    exerciseName,
    exerciseInstructions,
    exerciseMuscleType,
    exerciseType,
    exerciseLevel,
    userId,
  } = req.body;

  try {
    const newExercise = new Exercise({
      exerciseName,
      exerciseInstructions,
      exerciseMuscleType,
      exerciseType,
      exerciseLevel,
      userId,
    });

    await newExercise.save();
    res.status(201).json({ message: "Exercise created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LIST exercises by user
router.get("/list", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Missing userId in query parameters" });
  }

  try {
    const exercises = await Exercise.find({ userId });
    res.status(200).json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// EDIT exercise
router.put("/edit/:id", async (req, res) => {
  console.log("=== [PUT] /api/exercise/edit/:id ===");
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  const exerciseId = req.params.id;
  const {
    exerciseName,
    exerciseInstructions,
    exerciseMuscleType,
    exerciseType,
    exerciseLevel,
    userId,
  } = req.body;

  // Validace
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid or missing user ID." });
  }

  if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
    return res.status(400).json({ error: "Invalid exercise ID." });
  }

  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      {
        exerciseName,
        exerciseInstructions,
        exerciseMuscleType,
        exerciseType,
        exerciseLevel,
        userId,
      },
      { new: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({ error: "Exercise not found." });
    }

    return res.status(200).json(updatedExercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

// DELETE exercise
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid exercise ID" });
  }

  try {
    const deleted = await Exercise.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.status(200).json({ message: "Exercise deleted successfully", deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single exercise by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
