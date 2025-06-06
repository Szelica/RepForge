const mongoose = require("mongoose");

if (mongoose.models.Exercise) {
  delete mongoose.models.Exercise;
}

const ExerciseSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true },
  exerciseInstructions: { type: String },
  exerciseMuscleType: { type: [String], required: true },
  exerciseType: { type: [String], required: true },
  exerciseLevel: { type: String, required: true },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
