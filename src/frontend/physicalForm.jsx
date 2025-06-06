import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import * as React from "react";
import { useState, useContext } from "react"; //  přidáno useContext
import { useNavigate } from "react-router-dom"; //  přidáno navigate
import { UserContext } from "../context/UserContext"; //  přidán kontext
import LevelSelecter from "./componentsPsysicalForm/levelSelect.jsx";
import WorkoutSelecter from "./componentsPsysicalForm/workoutSelect.jsx";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

let theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff" },
  },
});

theme = createTheme(theme, {
  palette: {
    info: { main: theme.palette.secondary.main },
  },
});

const PhysicalForm = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");

  const { currentUser, setCurrentUser } = useContext(UserContext); 
  const navigate = useNavigate(); 

  
  const handleSkip = async () => {
  if (!currentUser || !currentUser._id) {
    alert("No current user available");
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/auth/profile/${currentUser._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) throw new Error("Skipping failed");

    const updatedUser = await res.json();
    console.log(" Skipped update:", updatedUser);

    setCurrentUser(updatedUser);
    navigate("/profile"); // přesměruj po skipnutí

  } catch (error) {
    console.error(" Error skipping physical form:", error);
    alert("Error skipping physical form.");
  }
};


  const handleSubmit = async () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weight && (isNaN(weightNum) || weightNum < 20 || weightNum > 300)) {
      alert("Please enter a valid weight between 20 and 300 kg.");
      return;
    }

    if (height && (isNaN(heightNum) || heightNum < 100 || heightNum > 250)) {
      alert("Please enter a valid height between 100 and 250 cm.");
      return;
    }

    if (!currentUser || !currentUser._id) {
      alert("No current user available.");
      return;
    }

    const payload = {};
    if (weight) payload.weight = weightNum;
    if (height) payload.height = heightNum;
    if (fitnessLevel) payload.fitnessLevel = fitnessLevel;
    if (workoutStyle) payload.workoutStyle  = workoutStyle;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/auth/profile/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Saving failed");

      const updatedUser = await res.json();
      console.log(" Updated user:", updatedUser); // 🔧

      setCurrentUser(updatedUser); // 🔧 aktualizuj UserContext
      alert("Physical data saved successfully!");
      navigate("/profile"); // 🔧 přesměrování

    } catch (error) {
      console.error(" Error saving physical data:", error);
      alert("Error saving physical data.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="createAccount">
        <h1 className="header">Add your details</h1>
        <Form.Group className="mb-3" controlId="createAccountForm">
          <Form.Label>
            Weight:
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your weight"
            className="mb-3"
            style={{ width: "300px" }}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Form.Label>
            Height:
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your height"
            className="mb-3"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          <div className="mb-3">
            Fitness level
            <LevelSelecter onChange={(value) => setFitnessLevel(value)} />
          </div>

          <div className="mb-3">
            Workout style
            <br />
            <WorkoutSelecter onChange={(value) => setWorkoutStyle(value)} />
          </div>
        </Form.Group>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "320px", // omez šířku tlačítek
            margin: "24px auto 0",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSkip}
            id="signupButton"
            style={{
              width: "140px",
              height: "48px",
            }}
          >
            <strong>Skip</strong>
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            id="signupButton"
            style={{
              width: "140px",
              height: "48px",
            }}
          >
            <strong>Confirm</strong>
          </Button>
        </div>

      </div>
    </ThemeProvider>
  );
};

export default PhysicalForm;
