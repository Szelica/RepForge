const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // Nová pole pro profil
    fitnessLevel: { type: String },
    height: { type: String },
    weight: { type: String },
    workoutStyle: [{ type: String }]
});

module.exports = mongoose.model("User", UserSchema);