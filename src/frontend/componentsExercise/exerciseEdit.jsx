import { useContext, useState, useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import Select from "react-select";
import { UserContext } from "../../context/UserContext";

const muscleOptions = [
  { value: "Abs", label: "Abs" },
  { value: "Biceps", label: "Biceps" },
  { value: "Calves", label: "Calves" },
  { value: "Chest", label: "Chest" },
  { value: "Forearms", label: "Forearms" },
  { value: "Glutes", label: "Glutes" },
  { value: "Hamstrings", label: "Hamstrings" },
  { value: "Lats", label: "Lats" },
  { value: "Lower Back", label: "Lower Back" },
  { value: "Middle Back", label: "Middle Back" },
  { value: "Shoulders", label: "Shoulders" },
  { value: "Quadriceps", label: "Quadriceps" },
  { value: "Traps", label: "Traps" },
  { value: "Triceps", label: "Triceps" },
];

const exerciseTypeOptions = [
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

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default function ExerciseEdit({ onClose, onUpdate, exercise }) {
  const { currentUser } = useContext(UserContext);

  const [exerciseData, setExerciseData] = useState({
    exerciseName: "",
    exerciseInstructions: "",
    exerciseMuscleType: [],
    exerciseType: [],
    exerciseLevel: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (exercise) {
      setExerciseData({
        exerciseName: exercise.exerciseName || "",
        exerciseInstructions: exercise.exerciseInstructions || "",
        exerciseMuscleType: exercise.exerciseMuscleType || [],
        exerciseType: exercise.exerciseType || [],
        exerciseLevel: capitalize(exercise.exerciseLevel || ""),
      });
    }
  }, [exercise]);

  const handleChange = (e) => {
    setExerciseData({ ...exerciseData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!exerciseData.exerciseName.trim())
      newErrors.exerciseName = "Name is required!";
    if (exerciseData.exerciseMuscleType.length === 0)
      newErrors.exerciseMuscleType = "Select at least one muscle group!";
    if (exerciseData.exerciseType.length === 0)
      newErrors.exerciseType = "Select at least one exercise type!";
    if (!exerciseData.exerciseLevel)
      newErrors.exerciseLevel = "Select difficulty level!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEdit = !!exercise?._id;

    if (!currentUser || !currentUser._id) {
      console.error("Missing user ID.");
      return;
    }

    if (!validateForm()) return;

    const payload = {
      ...exerciseData,
      exerciseLevel: isEdit
        ? exerciseData.exerciseLevel.toLowerCase()
        : exerciseData.exerciseLevel, // create expects 'Beginner', etc.
      userId: currentUser._id,
    };

    console.log(`${isEdit ? "Updating" : "Creating"} exercise:`, payload);
    onUpdate(payload);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="createExercise">
        <h1 className="createExerciseHeader">Your Exercise</h1>
        <Form.Group className="mb-3">
          {/* Name */}
          <Form.Label>
            Name:<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="exerciseName"
            placeholder="e.g. Push Up"
            className="mb-3"
            isInvalid={!!errors.exerciseName}
            value={exerciseData.exerciseName}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            {errors.exerciseName}
          </Form.Control.Feedback>

          {/* Instructions */}
          <Form.Label>Instruction:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="exerciseInstructions"
            className="mb-3"
            value={exerciseData.exerciseInstructions}
            onChange={handleChange}
          />

          {/* Muscle Group */}
          <Form.Label>
            Muscle Group:<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Select
            isMulti
            name="exerciseMuscleType"
            options={muscleOptions}
            value={muscleOptions.filter((option) =>
              exerciseData.exerciseMuscleType.includes(option.value)
            )}
            onChange={(selected) =>
              setExerciseData({
                ...exerciseData,
                exerciseMuscleType: selected.map((option) => option.value),
              })
            }
            styles={customSelectStyles}
          />
          {errors.exerciseMuscleType && (
            <div style={{ color: "red", marginTop: 4, fontSize: "0.875rem" }}>
              {errors.exerciseMuscleType}
            </div>
          )}

          {/* Exercise Type */}
          <Form.Label className="mt-3">
            Exercise Type:<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Select
            isMulti
            name="exerciseType"
            options={exerciseTypeOptions}
            value={exerciseTypeOptions.filter((option) =>
              exerciseData.exerciseType.includes(option.value)
            )}
            onChange={(selected) =>
              setExerciseData({
                ...exerciseData,
                exerciseType: selected.map((option) => option.value),
              })
            }
            styles={customSelectStyles}
          />
          {errors.exerciseType && (
            <div style={{ color: "red", marginTop: 4, fontSize: "0.875rem" }}>
              {errors.exerciseType}
            </div>
          )}

          {/* Difficulty */}
          <Form.Label className="mt-3">
            Difficulty Level:<span style={{ color: "red" }}>*</span>
          </Form.Label>
          <Form.Select
            name="exerciseLevel"
            value={exerciseData.exerciseLevel}
            onChange={handleChange}
            isInvalid={!!errors.exerciseLevel}
            className="mb-3"
          >
            <option value="">- Choose Difficulty -</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.exerciseLevel}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ backgroundColor: theme.palette.primary.dark, color: "#fff" }}
          >
            <strong>Cancel</strong>
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            <strong>Save</strong>
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

// Styles for react-select
const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderColor: "#c1ff72",
    color: "#000000",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    color: "#000000",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f0f0f0" : "#ffffff",
    color: "#000000",
  }),
  input: (base) => ({
    ...base,
    color: "#000000",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#000000",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e0e0e0",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#000000",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#000000",
    ":hover": {
      backgroundColor: "#c1ff72",
      color: "#000000",
    },
  }),
};
