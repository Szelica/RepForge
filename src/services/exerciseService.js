import axios from "axios";

// Dynamicky nastaví BASE_URL podľa prostredia
const API = process.env.REACT_APP_API_URL || "";
const BASE_URL = `${API}/api/exercise`;

// Fetch exercises
export const fetchExercises = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/list`, {
      params: { userId },
    });
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

// Create new exercise
export const createExercise = async (exerciseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, exerciseData);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

// Edit existing exercise
export const editExercise = async (id, exerciseData) => {
  try {
    const response = await axios.put(`${BASE_URL}/edit/${id}`, exerciseData);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

// Delete exercise
export const deleteExercise = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

// Fetch exercise by ID
export const fetchExerciseById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};
