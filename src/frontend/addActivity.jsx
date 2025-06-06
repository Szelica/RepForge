import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import * as React from "react";
import { useContext, useState } from "react";

import ActivitySelecter from "./componentsAddActivity/checkSelecter.jsx";
import { createActivity } from "../services/activityService.js";
import { UserContext } from "../context/UserContext.js";

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

const PhysicalForm = ({ onClose, onCreated }) => {
  const { currentUser } = useContext(UserContext);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [note2, setNote2] = useState("");

  const handleSubmit = async () => {
    if (!currentUser?._id) return alert("User not logged in.");
    if (!name.trim()) return alert("Name is required.");

    try {
      await createActivity({
        userId: currentUser._id,
        name,
        note: `${notes} ${note2}`,
        date: new Date().toISOString(),
        time: "00:00",
        duration: "0 min",
        exercises: [],
      });

      if (onCreated) onCreated();
    } catch (err) {
      console.error("Failed to create activity:", err);
      alert("Failed to create activity.");
    }
  };

// 🛠 Optional base URL if using fetch directly in future
  const API_BASE_URL = process.env.REACT_APP_API_URL || "";

  return (
    <ThemeProvider theme={theme}>
      <div
        className="createAccounts"
        style={{
          borderRadius: "16px",
          backgroundColor: "#2c2c2c",
          padding: "24px",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          color: "white",
        }}
      >
        <h1 className="header" style={{ color: "#c1ff72" }}>
          Add Activity
        </h1>
        <Form.Group className="mb-3" controlId="createAccountForm">
          <Form.Label>
            Name:<span id="required">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lorem Ipsum"
            className="mb-3"
            style={{ width: "315px" }}
          />

          <Form.Label>
            Notes:<span id="required">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes..."
            className="mb-3"
          />

          <div className="mb-3">
            Choose your workout <span id="required">*</span>
            <ActivitySelecter />
          </div>

          <div className="mb-3">
            <Form.Label>
              Notes:<span id="required">*</span>
              <Form.Control
                type="text"
                value={note2}
                onChange={(e) => setNote2(e.target.value)}
                placeholder="Additional note"
                className="mb-3"
                style={{ width: "315px" }}
              />
            </Form.Label>
          </div>
          <p id="required">Required *</p>
        </Form.Group>
        <p>
          <Button
            variant="contained"
            id="signupButton"
            style={{ marginRight: "58px", backgroundColor: "#4d4d4d" }}
            onClick={onClose}
          >
            <strong>Cancel</strong>
          </Button>

          <Button
            variant="contained"
            id="signupButton"
            style={{ marginRight: "10px" }}
            onClick={handleSubmit}
          >
            <strong>Add</strong>
          </Button>
        </p>
      </div>
    </ThemeProvider>
  );
};

export default PhysicalForm;