import axios from "axios";

// Set API base URL dynamically (useful for both local and production)
const API = process.env.REACT_APP_API_URL || "";
const BASE_URL = `${API}/api/workout`;

// GET all workouts for a specific user
export const fetchWorkouts = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/list`, {
      params: { userId },
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

// POST new workout to the backend
export const createWorkout = async (workoutData) => {
  try {
    const res = await axios.post(`${BASE_URL}/create`, workoutData);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

// DELETE workout by ID
export const deleteWorkout = async (workoutId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/delete/${workoutId}`);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

// PUT update workout by ID
export const editWorkout = async (workoutId, updatedData) => {
  try {
    const res = await axios.put(`${BASE_URL}/edit/${workoutId}`, updatedData);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};
