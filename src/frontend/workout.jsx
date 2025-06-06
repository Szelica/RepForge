import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Chip, Button, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkoutEdit from "./componentsWorkout/workoutEdit.jsx";
import {
  fetchWorkouts,
  createWorkout,
  deleteWorkout,
  editWorkout,
} from "../services/workoutService.js";
import { fetchExercises } from "../services/exerciseService.js";
import { UserContext } from "../context/UserContext.js";
import Card from "./components/Card.jsx";
import Header from "./components/Header.jsx";
import WarningModal from "./components/WarningModal.jsx";
import "./CSS/workoutStyle.css"


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#2c2c2c",
  color: "white",
  padding: 4,
  borderRadius: 2,
  width: "95%",
  maxWidth: 600,
  maxHeight: "90vh",
  overflowY: "auto",
};


export default function Workout() {
  const { currentUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  useEffect(() => {
    if (currentUser?._id) {
      loadWorkouts();
      loadExercises();
    }
  }, [currentUser]);

  async function loadWorkouts() {
    if (!currentUser?._id) return;

    try {
      const data = await fetchWorkouts(currentUser._id);
      setWorkouts(data);
    } catch (err) {
      console.error("Failed to load workouts:", err);
    }
  }

  async function loadExercises() {
    try {
      const data = await fetchExercises(currentUser._id);
      setExercises(data);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    }
  }

  const handleOpen = (workout) => {
    setSelectedWorkout(workout);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedWorkout(null);
    setOpen(false);
  };

  const handleUpdate = async (updatedData) => {
  try {
    const trimmedName = updatedData.name.trim().toLowerCase();

    const nameExists = workouts.some(
      (w) =>
        w.name.trim().toLowerCase() === trimmedName &&
        (!selectedWorkout || w._id !== selectedWorkout._id)
    );

    if (nameExists) {
      alert("Trénink s tímto názvem už existuje. Zvol jiný název.");
      return;
    }

    if (selectedWorkout) {
      await editWorkout(selectedWorkout._id, updatedData); // aktualizace
    } else {
      const newWorkout = {
        ...updatedData,
        userId: currentUser._id, // doplň userId při vytváření
      };
      await createWorkout(newWorkout);
    }

    await loadWorkouts(); // obnov seznam
    handleClose(); // zavři modal
  } catch (err) {
    console.error("Failed to save workout:", err);
    alert(
      "Failed to save workout: " +
        (err?.response?.data?.error || "Server error")
    );
  }
};


  const confirmDelete = (workout) => {
    setWorkoutToDelete(workout);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteWorkout(workoutToDelete._id);
      setWorkouts((prev) => prev.filter((w) => w._id !== workoutToDelete._id));
    } catch (err) {
      console.error("Failed to delete workout:", err);
    } finally {
      setConfirmOpen(false);
      setWorkoutToDelete(null);
    }
  };

  return (
    <>
      <Header />

      <div className="workoutPage">
        {/* Add New Workout Button */}
        <div className="addWorkoutButton">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c1ff72",
              color: "#000",
              fontWeight: "bold",
            }}
            onClick={() => {
              setSelectedWorkout(null);
              setOpen(true);
            }}
          >
            Add New Workout
          </Button>
        </div>

        {/* Workouts */}
        {workouts.length === 0 ? (
          <Typography sx={{ color: "white", mt: 4 }}>
            No workouts found. Click <br />
            "Add New Workout" to create one.
          </Typography>
        ) : (
          <div className="workoutCards">
            {workouts.map((workout) => (
              <Box key={workout._id} sx={{ width: 320 }}>
                <Card
                  header={workout.name}
                  firstButton={{
                    label: "Edit",
                    onClick: () => handleOpen(workout),
                  }}
                  secondButton={{
                    label: <DeleteIcon />,
                    onClick: () => confirmDelete(workout),
                  }}
                >
                  <Typography sx={{ mb: 1 }}>
                    <strong>Instruction:</strong> {workout.instruction}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Difficulty Level:</strong> {workout.difficultyLevel}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Workout Type:</strong> {workout.workoutType}
                  </Typography>

                  {workout.exercises?.length > 0 && (
                    <>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        <strong>Exercises:</strong>
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {workout.exercises.map((exerciseId, idx) => {
                          const exercise = exercises.find(
                            (ex) => ex._id === exerciseId
                          );
                          return (
                            <Chip
                              key={idx}
                              label={exercise?.exerciseName || "Unknown"}
                              size="small"
                              sx={{
                                backgroundColor: "#c1ff72",
                                color: "#000",
                                fontWeight: "bold",
                              }}
                            />
                          );
                        })}
                      </Box>
                    </>
                  )}
                </Card>
              </Box>
            ))}
          </div>
        )}

        {/* Modal & Confirm */}
        <Modal
          open={open}
          onClose={(event, reason) => {
            if (reason === "backdropClick") return;
            handleClose();
          }}
          disableEscapeKeyDown
        >
          <Box sx={modalStyle}>
            <WorkoutEdit
              workout={selectedWorkout}
              onClose={handleClose}
              onUpdate={handleUpdate}
            />
          </Box>
        </Modal>

        <WarningModal
          open={confirmOpen}
          text={`Do you really want to delete "${workoutToDelete?.name}"?`}
          leftButton={{ label: "Cancel", onClick: () => setConfirmOpen(false) }}
          rightButton={{ label: "Delete", onClick: handleDeleteConfirmed }}
        />
      </div>
    </>
  );
}
