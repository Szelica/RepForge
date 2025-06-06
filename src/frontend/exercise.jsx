import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Chip, Button, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExerciseEdit from "./componentsExercise/exerciseEdit.jsx";
import { UserContext } from "../context/UserContext.js";
import {
  createExercise,
  fetchExercises,
  editExercise,
  deleteExercise,
} from "../services/exerciseService.js";
import Header from "./components/Header.jsx";
import Card from "./components/Card.jsx";
import WarningModal from "./components/WarningModal";

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

export default function Exercise() {
  const { currentUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  useEffect(() => {
    if (currentUser?._id) loadExercises();
  }, [currentUser]);

  const loadExercises = async () => {
    try {
      const data = await fetchExercises(currentUser._id);
      setExercises(data);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    }
  };

  const handleOpen = (exercise) => {
    setSelectedExercise(exercise);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedExercise(null);
    setOpen(false);
  };

  const handleUpdate = async (updatedData) => {
    try {
      const trimmedName = updatedData.exerciseName.trim().toLowerCase();
      const nameExists = exercises.some(
        (e) =>
          e.exerciseName.trim().toLowerCase() === trimmedName &&
          (!selectedExercise || e._id !== selectedExercise._id)
      );

      if (nameExists) {
        alert("Exercise with this name already exists.");
        return;
      }

      if (selectedExercise) {
        await editExercise(selectedExercise._id, updatedData);
      } else {
        await createExercise(updatedData);
      }

      await loadExercises();
      handleClose();
    } catch (err) {
      console.error("Failed to save exercise:", err);
      alert("Failed to save exercise.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExercise(id);
      await loadExercises();
    } catch (err) {
      console.error("Failed to delete exercise:", err);
    }
  };

  const confirmDelete = async () => {
    if (!exerciseToDelete) return;
    await handleDelete(exerciseToDelete._id);
    setExerciseToDelete(null);
    setShowWarning(false);
  };

  const cancelDelete = () => {
    setExerciseToDelete(null);
    setShowWarning(false);
  };

  return (
    <>
      <Header />
      <Box className="exercisePage">
        <Box className="addExerciseButton">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c1ff72",
              color: "#000",
              fontWeight: "bold",
            }}
            onClick={() => {
              setSelectedExercise(null);
              setOpen(true);
            }}
          >
            Add New Exercise
          </Button>
        </Box>

        {exercises.length === 0 ? (
          <Typography sx={{ color: "white", textAlign: "center" }}>
            You have no exercises yet.
            <br />
            Click "Add New Exercise" to create one.
          </Typography>
        ) : (
          <Box className="exerciseCards">
            {exercises.map((exercise) => (
              <Box key={exercise._id} sx={{ width: 320 }}>
                <Card
                  header={exercise.exerciseName}
                  firstButton={{
                    label: "Edit",
                    onClick: () => handleOpen(exercise),
                  }}
                  secondButton={{
                    label: <DeleteIcon />,
                    onClick: () => {
                      setExerciseToDelete(exercise);
                      setShowWarning(true);
                    },
                  }}
                >
                  <Typography sx={{ mb: 1 }}>
                    <strong>Instructions:</strong>{" "}
                    {exercise.exerciseInstructions}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Muscle Groups:</strong>{" "}
                    {exercise.exerciseMuscleType.map((muscle) => (
                      <Chip
                        key={muscle}
                        label={muscle}
                        size="small"
                        sx={{
                          backgroundColor: "#666",
                          color: "white",
                          marginRight: 0.5,
                          mb: 0.5,
                        }}
                      />
                    ))}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Type:</strong>{" "}
                    {exercise.exerciseType.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        size="small"
                        sx={{
                          backgroundColor: "#3a6ea5",
                          color: "white",
                          marginRight: 0.5,
                          mb: 0.5,
                        }}
                      />
                    ))}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    <strong>Level:</strong>{" "}
                    <Chip
                      label={exercise.exerciseLevel}
                      size="small"
                      sx={{ backgroundColor: "#999", color: "white" }}
                    />
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        <Modal
          open={open}
          onClose={(event, reason) => {
            if (reason === "backdropClick") return;
            handleClose();
          }}
          disableEscapeKeyDown
        >
          <Box sx={modalStyle}>
            <ExerciseEdit
              exercise={selectedExercise}
              onClose={handleClose}
              onUpdate={handleUpdate}
            />
          </Box>
        </Modal>

        <WarningModal
          open={showWarning}
          text={`Do you really want to delete "${exerciseToDelete?.exerciseName}"?`}
          leftButton={{ label: "Cancel", onClick: cancelDelete }}
          rightButton={{ label: "Delete", onClick: confirmDelete }}
        />
      </Box>
    </>
  );
}
