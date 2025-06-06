import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Icon from "@mdi/react";
import Select from "react-select";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProfileHeader from "./componentsProfile/ProfileHeader";
import ProfileInfoCard from "./componentsProfile/ProfileInfoCard";
import { UserContext } from "../context/UserContext";
import {
  profileData,
  workoutTypeOptions,
  fitnessLevelOptions,
} from "./componentsProfile/profileData.jsx";

import {
  mdiAccount,
  mdiEmail,
  mdiScale,
  mdiHumanMaleHeight,
  mdiDumbbell,
  mdiSignalCellular3,
  mdiPencil,
} from "@mdi/js";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

let theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff", dark: "#4d4d4d" },
  },
});

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [userData, setUserData] = useState(profileData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  function handleChange(field, value) {
    if (field === "weight" || field === "height") {
      if (!/^\d*$/.test(value)) return;
    }
    setUserData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!userData.name?.trim()) return alert("Name cannot be empty.");
    if (!/^\S+@\S+\.\S+$/.test(userData.email?.trim())) return alert("Invalid email.");

    let weight = parseInt(userData.weight?.trim(), 10);
    let height = parseInt(userData.height?.trim(), 10);
    if (isNaN(weight) || weight < 20 || weight > 300) return alert("Weight must be between 20 and 300 kg.");
    if (isNaN(height) || height < 100 || height > 250) return alert("Height must be between 100 and 250 cm.");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Failed to save profile");

      const updatedUser = await res.json();
      alert("Profile successfully saved.");
      setUserData(updatedUser);
      setCurrentUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving profile.");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <ProfileHeader />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {isEditing && (
          <Typography color="error" fontWeight="bold" mb={2}>
            Click on the button to save changes.
          </Typography>
        )}

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h4" color="white">
            About Me
          </Typography>
          <button id="editProfileIcon" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
            <Icon path={mdiPencil} size={1.5} />
          </button>
        </Box>

        {/* 🔧 Profile Info Cards centered in a max-width Box */}
        <Box sx={{ width: "100%", maxWidth: 360, mx: "auto", height: "100vh"}}>
          <ProfileInfoCard icon={mdiAccount} label="Name" value={userData.name} field="name" onChange={handleChange} isEditing={isEditing} editable />
          <ProfileInfoCard icon={mdiEmail} label="Email" value={userData.email} field="email" onChange={handleChange} isEditing={isEditing} editable />

          <ProfileInfoCard
            icon={mdiDumbbell}
            label="Workout style"
            value={isEditing ? undefined : Array.isArray(userData.workoutStyle) ? userData.workoutStyle.join(", ") : userData.workoutStyle}
            field="workoutStyle"
            onChange={handleChange}
            isEditing={isEditing}
            editable
            customInput={
              isEditing && (
                <Select
                  isMulti
                  options={workoutTypeOptions}
                  value={workoutTypeOptions.filter((opt) => userData.workoutStyle?.includes(opt.value))}
                  onChange={(selected) => handleChange("workoutStyle", selected.map((o) => o.value))}
                  styles={customSelectStyles}
                />
              )
            }
          />

          <ProfileInfoCard
            icon={mdiSignalCellular3}
            label="Fitness level"
            value={isEditing ? undefined : userData.fitnessLevel}
            field="fitnessLevel"
            onChange={handleChange}
            isEditing={isEditing}
            editable
            customInput={
              isEditing && (
                <Select
                  options={fitnessLevelOptions}
                  value={fitnessLevelOptions.find((opt) => opt.value === userData.fitnessLevel)}
                  onChange={(selected) => handleChange("fitnessLevel", selected?.value || "")}
                  styles={customSelectStyles}
                />
              )
            }
          />

          <ProfileInfoCard icon={mdiScale} label="Weight" value={isEditing ? userData.weight : `${userData.weight || ""} kg`} field="weight" onChange={handleChange} isEditing={isEditing} editable />
          <ProfileInfoCard icon={mdiHumanMaleHeight} label="Height" value={isEditing ? userData.height : `${userData.height || ""} cm`} field="height" onChange={handleChange} isEditing={isEditing} editable />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

const customSelectStyles = {
  control: (base) => ({ ...base, backgroundColor: "#2c2c2c", borderColor: "#c1ff72", color: "#fff" }),
  menu: (base) => ({ ...base, backgroundColor: "#2c2c2c" }),
  multiValue: (base) => ({ ...base, backgroundColor: "#c1ff72" }),
  multiValueLabel: (base) => ({ ...base, color: "#000" }),
  multiValueRemove: (base) => ({ ...base, color: "#000", ":hover": { backgroundColor: "#ff0000", color: "#fff" } }),
  singleValue: (base) => ({ ...base, color: "#fff" }),
};

export default Profile;
