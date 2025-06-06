const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Activity = require("../models/activity");

// Create a new activity
router.post("/create", async (req, res) => {
  const {
    userId,
    name,
    date,
    time,
    duration,
    note,
    workoutId,
    exercises,
    repetitions,
  } = req.body;

  try {
    const newActivity = new Activity({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      date,
      time,
      duration,
      note,
      workoutId: workoutId ? new mongoose.Types.ObjectId(workoutId) : null,
      repetitions,
      exercises: exercises.map((ex) => ({
        exerciseId: new mongoose.Types.ObjectId(ex.exerciseId),
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
      })),
    });

    await newActivity.save();
    res.status(201).json({ message: "Activity created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all activities for a user
router.get("/list/:userId", async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.params.userId);
    const activities = await Activity.find({ userId: userObjectId });
    res.status(200).json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch activity" });
  }
});

//  Edit (update) an existing activity
router.put("/edit/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const {
    name,
    date,
    time,
    duration,
    note,
    workoutId,
    exercises,
    repetitions,
  } = req.body;

  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        name,
        date,
        time,
        duration,
        note,
        repetitions,
        workoutId: workoutId ? new mongoose.Types.ObjectId(workoutId) : null,
        exercises: exercises.map((ex) => ({
          exerciseId: new mongoose.Types.ObjectId(ex.exerciseId),
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
        })),
      },
      { new: true } // return the updated document
    );

    if (!updatedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update activity" });
  }
});

// DELETE activity
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid exercise ID" });
  }

  try {
    const deleted = await Activity.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.status(200).json({ message: "Exercise deleted successfully", deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
