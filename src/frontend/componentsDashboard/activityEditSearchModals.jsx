import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import {
  modalStyles,
  searchInputStyle,
  listStyle,
  listItemStyle,
} from "./activityEditStyles";

export const ExerciseSearchModal = ({
  open,
  onClose,
  onSelect,
  exerciseList,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState(null); // <- přidáno

  const filtered = exerciseList.filter((ex) =>
    ex.exerciseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (exercise) => {
    setSelectedExerciseId(exercise._id); // uloží id do lokálního stavu
    onSelect(exercise); // předá celý objekt nahoru
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyles}>
        <h2>Find an Exercise</h2>
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <ul style={listStyle}>
          {filtered.map((ex) => (
            <li
              key={ex._id}
              style={{
                ...listItemStyle,
                backgroundColor:
                  selectedExerciseId === ex._id ? "#c1ff72" : "transparent",
              }}
              onClick={() => handleSelect(ex)}
            >
              {ex.exerciseName}
            </li>
          ))}
        </ul>
      </Box>
    </Modal>
  );
};

export const WorkoutSearchModal = ({
  open,
  onClose,
  onSelect,
  workoutList,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  const filtered = workoutList.filter((workout) =>
    (workout.workoutName || workout.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSelect = (workout) => {
    setSelectedWorkoutId(workout._id); // uloží id
    onSelect(workout);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyles}>
        <h2>Find your Workout</h2>
        <input
          type="text"
          placeholder="Search workout..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <ul style={listStyle}>
          {filtered.map((workout) => (
            <li
              key={workout._id}
              style={{
                ...listItemStyle,
                backgroundColor:
                  selectedWorkoutId === workout._id ? "#c1ff72" : "transparent",
              }}
              onClick={() => handleSelect(workout)}
            >
              {workout.workoutName || workout.name}
            </li>
          ))}
        </ul>
      </Box>
    </Modal>
  );
};
