import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/activity`
  : "/api/activity";


export const createActivity = async (activityData) => {
  try {
    const response = await axios.post(`${BASE_URL}/create`, activityData);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

export const fetchActivities = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/list/${userId}`);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};

export const editActivity = async (activityId, updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/edit/${activityId}`,
      updatedData
    );
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};
//přídání deleteActivity
export const deleteActivity = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (err) {
    throw err.response ? err.response.data : { error: "Network error" };
  }
};
