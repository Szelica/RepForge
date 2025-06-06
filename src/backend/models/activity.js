const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  note: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String },
  repetitions: { type: String },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exercises: [
    {
      _id: false,
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    },
  ],
});

module.exports = mongoose.model("Activity", activitySchema);
