import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import Select from "react-select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { UserContext } from "../../context/UserContext";
import { fetchExercises } from "../../services/exerciseService";

const workoutTypeOptions = [
  { value: "Cardio", label: "Cardio" },
  { value: "Strength", label: "Strength" },
];

const theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff" },
    info: { main: "#ffffff" },
  },
});

export default function WorkoutEdit({ onClose, onUpdate, workout }) {
  const { currentUser } = useContext(UserContext);

  const [workoutData, setFormData] = useState({
    name: "",
    instruction: "",
    workoutType: "",
    workoutExercises: [],
    difficultyLevel: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [exerciseList, setExerciseList] = useState([]);

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      color: "#000",
      borderColor: "#ced4da",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000",
    }),
    input: (provided) => ({
      ...provided,
      color: "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#000",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      color: "#000",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e6e6e6" : "#fff",
      color: "#000",
    }),
  };

  useEffect(() => {
    if (workout) {
      setFormData({
        name: workout.name || "",
        instruction: workout.instruction || "",
        workoutType: workout.workoutType || "",
        workoutExercises: workout.exercises || [],
        difficultyLevel: capitalize(workout.difficultyLevel || ""),
      });
    }
  }, [workout]);

  useEffect(() => {
    const loadExercises = async () => {
      if (!currentUser?._id) return;
      try {
        const data = await fetchExercises(currentUser._id);
        setExerciseList(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      }
    };
    loadExercises();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...workoutData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!workoutData.name.trim()) newErrors.name = "Name is required!";
    if (workoutData.workoutExercises.length === 0)
      newErrors.workoutExercises = "Select at least one exercise!";
    if (!workoutData.workoutType)
      newErrors.workoutType = "Select workout type!";
    if (!workoutData.difficultyLevel)
      newErrors.difficultyLevel = "Select difficulty level!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      //výpis dat do konzole
      console.log("Workout data submitted:", {
        name: workoutData.name,
        instruction: workoutData.instruction,
        difficultyLevel: workoutData.difficultyLevel.toLowerCase(),
        workoutType: workoutData.workoutType,
        exercises: workoutData.workoutExercises,
        userId: currentUser._id,
      });
      onUpdate({
        name: workoutData.name,
        instruction: workoutData.instruction,
        difficultyLevel: workoutData.difficultyLevel.toLowerCase(),
        workoutType: workoutData.workoutType,
        exercises: workoutData.workoutExercises,
        userId: currentUser._id,
      });
    }
  };

  const handleAddExercise = (exerciseId) => {
    if (exerciseId && !workoutData.workoutExercises.includes(exerciseId)) {
      setFormData({
        ...workoutData,
        workoutExercises: [...workoutData.workoutExercises, exerciseId],
      });
    }
    setModalOpen(false);
  };

  const ExerciseSearchModal = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = exerciseList.filter((ex) =>
      ex.exerciseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #c1ff72",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Find an Exercise</h2>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <ul style={{ maxHeight: "200px", overflowY: "auto", padding: 0 }}>
            {filtered.map((ex, idx) => (
              <li
                key={ex._id || idx}
                style={{
                  listStyle: "none",
                  padding: "0.5rem",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
                onClick={() => handleAddExercise(ex._id)}
              >
                {ex.exerciseName}
              </li>
            ))}
          </ul>
        </Box>
      </Modal>
    );
  };

  const handleRemoveExercise = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      workoutExercises: prevData.workoutExercises.filter(
        (_, i) => i !== indexToRemove
      ),
    }));
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <ThemeProvider theme={theme}>
      <div className="createWorkout">
        <h1 className="createWorkoutHeader">Your Workout</h1>
        <Form.Group className="mb-3">
          <Form.Label>
            Name: <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={workoutData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>

          <Form.Label className="mt-3">Instruction:</Form.Label>
          <Form.Control
            as="textarea"
            name="instruction"
            value={workoutData.instruction}
            onChange={handleChange}
          />

          <Form.Label className="mt-3">
            Difficulty Level: <span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Select
            name="difficultyLevel"
            value={workoutData.difficultyLevel}
            onChange={handleChange}
            isInvalid={!!errors.difficultyLevel}
          >
            <option value="">-- Select --</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Select>
        </Form.Group>

        <Form.Label className="mt-3">
          Workout Type: <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Select
          isMulti={false}
          name="workoutType"
          options={workoutTypeOptions}
          value={workoutTypeOptions.find(
            (opt) => opt.value === workoutData.workoutType
          )}
          onChange={(selected) =>
            setFormData({
              ...workoutData,
              workoutType: selected.value,
            })
          }
          styles={customSelectStyles}
          placeholder="--Select--"
        />
        {errors.workoutType && (
          <div style={{ color: "red", marginTop: 4 }}>{errors.workoutType}</div>
        )}

        <Form.Label className="mt-3">Selected Exercises:</Form.Label>
        <Button
          variant="outlined"
          onClick={() => setModalOpen(true)}
          sx={{ mt: 2 }}
        >
          Search Exercises
        </Button>

        <ExerciseSearchModal />

        <div style={{ marginTop: "1rem" }}>
          {workoutData.workoutExercises.map((exerciseId, index) => {
            const exercise = exerciseList.find((ex) => ex._id === exerciseId);
            return (
              <div key={index}>
                {exercise?.exerciseName || "Unknown"}
                <button onClick={() => handleRemoveExercise(index)}>×</button>
              </div>
            );
          })}
        </div>
        {errors.workoutExercises && (
          <div style={{ color: "red", marginTop: 4 }}>
            {errors.workoutExercises}
          </div>
        )}

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
