const mongoose = require("mongoose");

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  instruction: { type: String },
  difficultyLevel: { type: String },
  workoutType: { type: String },
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
});

module.exports = mongoose.model("Workout", WorkoutSchema);
