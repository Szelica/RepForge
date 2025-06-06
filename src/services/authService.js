import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/auth`
  : "/api/auth";

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: "Network error" };
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    console.log("Login using API_URL:", API_URL);
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { error: "Network error" };
  }
};

// Logout user
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    const user = response.data.find((u) => u._id === userId);
    if (!user) throw new Error("User not found");
    return user;
  } catch (err) {
    const message = err.response?.data?.error || "Network error";
    throw new Error(message);
  }
};