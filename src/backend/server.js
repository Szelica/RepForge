require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/workout", workoutRoutes);

// ✅ Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../build", "index.html"));
  });
}


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
