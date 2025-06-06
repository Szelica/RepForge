const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Workout = require("../models/workout");

// Create a new workout
router.post("/create", async (req, res) => {
  const { name, instruction, difficultyLevel, workoutType, exercises, userId } =
    req.body;

  try {
    const newWorkout = new Workout({
      name,
      instruction,
      difficultyLevel,
      workoutType,
      exercises,
      userId: new mongoose.Types.ObjectId(userId), //
    });

    await newWorkout.save();
    res.status(201).json({ message: "Workout created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get list of workouts by user
router.get("/list", async (req, res) => {
  const { userId } = req.query;
  console.log("Fetching workouts for User ID:", req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    console.log("Workout list API: received userId:", userId);
    const workouts = await Workout.find({ userId });
    res.status(200).json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a workout
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Workout.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a workout
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name, instruction, difficultyLevel, workoutType, exercises } = req.body;

  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
        id,
        {
          name,
          instruction,
          difficultyLevel,
          workoutType,
          exercises,
        },
        { new: true } // Return the updated document
    );

    if (!updatedWorkout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json({ message: "Workout updated successfully", workout: updatedWorkout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
