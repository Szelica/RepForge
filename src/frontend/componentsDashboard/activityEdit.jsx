import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import { Button, Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRef } from "react";
import { fetchWorkouts } from "../../services/workoutService";
import { fetchExercises } from "../../services/exerciseService";
import { createActivity, editActivity } from "../../services/activityService";
import { UserContext } from "../../context/UserContext";
import { fetchExerciseById } from "../../services/exerciseService";
import {
  searchButtonStyle,
  chipContainerStyle,
  chipStyle,
  chipButtonStyle,
  buttonRowStyle,
} from "./activityEditStyles";
import {
  ExerciseSearchModal,
  WorkoutSearchModal,
} from "./activityEditSearchModals.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff" },
    info: { main: "#ffffff" },
  },
});

const ActivityEdit = ({ onClose, onUpdate, activity }) => {
  const { currentUser } = useContext(UserContext);

  const [activityData, setFormData] = useState({
    name: "",
    note: "",
    duration: "",
    repetitions: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    workoutExercises: [],
  });

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [errors, setErrors] = useState({});
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);

  const [workoutList, setWorkoutList] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [exercisesLoaded, setExercisesLoaded] = useState(false);
  useEffect(() => {
    if (exerciseList.length > 0) {
      console.log("EXERCISE LIST SAMPLE:", exerciseList[0]);
    }
  }, [exerciseList]);

  useEffect(() => {
    if (exerciseList.length > 0) {
      console.log("EXERCISE LIST SAMPLE:", exerciseList[0]);
    }
    const fetchData = async () => {
      if (!currentUser?._id) return;
      try {
        const workouts = await fetchWorkouts(currentUser._id);
        const exercises = await fetchExercises(currentUser._id);
        setWorkoutList(workouts);
        setExerciseList(exercises);
        setExercisesLoaded(true);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (!activity || !exercisesLoaded) return;

    const loadExercises = async () => {
      const mappedExercises = await Promise.all(
        (activity.exercises || []).map(async (ex) => {
          const id = (() => {
            if (typeof ex === "string") return ex;
            if (ex.exerciseId) return String(ex.exerciseId);
            if (ex._id) return String(ex._id);
            return null;
          })();

          let found = exerciseList.find((e) => String(e._id) === String(id));

          if (!found) {
            try {
              const fetched = await fetchExerciseById(id);
              found = fetched;
            } catch {
              return { _id: id, exerciseName: "⚠️ Missing Exercise" };
            }
          }

          return {
            _id: id,
            exerciseName:
              found.exerciseName || found.name || "Unnamed Exercise",
          };
        })
      );

      setFormData((prev) => ({
        ...prev,
        name: activity.name || "",
        note: activity.note || "",
        duration: activity.duration?.replace(" min", "") || "",
        repetitions: activity.repetitions || "",
        date: activity.date || new Date().toISOString().split("T")[0],
        time: activity.time || new Date().toTimeString().slice(0, 5),
        workoutExercises: mappedExercises,
      }));
    };

    loadExercises();
    console.log("Loading exercises for activity:", activity?._id);
    console.log("Raw activity.exercises:", activity.exercises);
  }, [activity, exercisesLoaded]);

  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (
      initialLoadRef.current &&
      activity &&
      activity.workoutId &&
      workoutList.length > 0
    ) {
      const workout = workoutList.find((w) => w._id === activity.workoutId);
      if (workout) {
        setSelectedWorkout(workout);
        handleAddWorkout(workout);
        initialLoadRef.current = false;
      }
    }
  }, [
    activity,
    workoutList,
    exerciseList,
    activityData.workoutExercises.length,
  ]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!activityData.name.trim()) {
      newErrors.name = "Name is required!";
    }

    if (!selectedWorkout && activityData.workoutExercises.length === 0) {
      newErrors.workoutExercises = "Select at least one exercise or workout!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Saving activity with workout ID:", selectedWorkout?._id);

    if (!validateForm()) return;

    if (selectedWorkout && !selectedWorkout._id) {
      alert("Selected workout is missing an ID. Cannot save activity.");
      console.error("Workout object without _id:", selectedWorkout);
      return;
    }

    try {
      const newActivity = {
        name: activityData.name,
        note: activityData.note,
        date: activityData.date,
        time: activityData.time,
        duration: `${activityData.duration} min`,
        repetitions: activityData.repetitions,
        userId: currentUser._id,
        exercises: activityData.workoutExercises.map((ex) => ({
          exerciseId: ex._id || ex.exerciseId,
        })),
        workoutId: selectedWorkout?._id || null,
      };

      console.log("Data to be saved:", newActivity);

      const saved = activity
        ? await editActivity(activity._id, newActivity)
        : await createActivity(newActivity);

      onUpdate?.(saved);
      onClose();
    } catch (error) {
      console.error("Failed to save activity:", error);
      alert("Failed to save activity. Check console for details.");
    }
  };

  const handleAddExercise = (exercise) => {
    if (
      exercise &&
      !activityData.workoutExercises.some((ex) => ex._id === exercise._id)
    ) {
      const exerciseWithName = {
        ...exercise,
        exerciseName:
          exercise.exerciseName || exercise.name || "Unnamed Exercise",
      };

      setFormData((prevData) => ({
        ...prevData,
        workoutExercises: [...prevData.workoutExercises, exerciseWithName],
      }));
    }
    setExerciseModalOpen(false);
  };

  const handleRemoveExercise = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      workoutExercises: prevData.workoutExercises.filter(
        (_, i) => i !== indexToRemove
      ),
    }));
  };

  const handleRemoveWorkout = () => {
    if (!selectedWorkout) return;

    const workoutExerciseIds = selectedWorkout.exercises.map(String); // převeď na string pro porovnání

    setSelectedWorkout(null);
    setFormData((prevData) => ({
      ...prevData,
      workoutExercises: prevData.workoutExercises.filter(
        (ex) => !workoutExerciseIds.includes(String(ex._id))
      ),
    }));
  };

  const handleAddWorkout = (workout) => {
    if (!workout || !Array.isArray(workout.exercises)) return;

    const newExercises = workout.exercises
      .map((exerciseId) =>
        exerciseList.find((ex) => String(ex._id) === String(exerciseId))
      )
      .filter(Boolean)
      .map((exercise) => ({
        _id: exercise._id,
        exerciseName:
          exercise.exerciseName || exercise.name || "Unnamed Exercise",
      }));

    setSelectedWorkout(workout);

    setFormData((prevData) => ({
      ...prevData,
      workoutExercises: [
        ...prevData.workoutExercises,
        ...newExercises.filter(
          (newEx) => !prevData.workoutExercises.some((e) => e._id === newEx._id)
        ),
      ],
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="createWorkout">
        <Box
          sx={{ display: "flex", justifyContent: "center", color: "#c1ff72" }}
        >
          <h1 className="createWorkoutHeader">
            <strong>{activity ? "Edit Activity" : "Create Activity"}</strong>
          </h1>
        </Box>

        <Form.Group className="mb-3">
          <Form.Label>
            Name:<span style={{ color: "#c1ff72" }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="e.g. Morning routine"
            className="mb-3"
            isInvalid={!!errors.name}
            value={activityData.name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>

          <Form.Label>Note:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="note"
            className="mb-3"
            value={activityData.note}
            onChange={handleChange}
          />

          <Form.Label>Duration: (in minutes)</Form.Label>
          <Form.Control
            type="number"
            name="duration"
            className="mb-3"
            value={activityData.duration}
            onChange={handleChange}
            min="1"
          />

          <Form.Label>Repetitions:</Form.Label>
          <Form.Control
            type="number"
            name="repetitions"
            className="mb-3"
            value={activityData.repetitions}
            onChange={handleChange}
            min="1"
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ flex: 1 }}>
                <Form.Label>Date:</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={activityData.date}
                  onChange={handleChange}
                  className="mb-3"
                />
              </div>
              <div style={{ flex: 1 }}>
                <Form.Label>Time:</Form.Label>
                <Form.Control
                  type="time"
                  name="time"
                  value={activityData.time}
                  onChange={handleChange}
                  className="mb-3"
                />
              </div>
            </div>
          </LocalizationProvider>
        </Form.Group>

        <Form.Label className="mt-3">Workout:</Form.Label>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => setWorkoutModalOpen(true)}
            sx={searchButtonStyle}
          >
            <strong>Search Workout</strong>
          </Button>
        </Box>

        {selectedWorkout && (
          <div style={{ ...chipStyle, marginTop: "0.5rem" }}>
            <span style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
              {selectedWorkout.workoutName || selectedWorkout.name}
            </span>
            <button onClick={handleRemoveWorkout} style={chipButtonStyle}>
              ×
            </button>
          </div>
        )}

        <WorkoutSearchModal
          open={workoutModalOpen}
          onClose={() => setWorkoutModalOpen(false)}
          onSelect={(workout) => {
            setSelectedWorkout(workout);
            handleAddWorkout(workout);
          }}
          workoutList={workoutList}
        />

        <Form.Label className="mt-3">
          Exercises:<span style={{ color: "#c1ff72" }}>*</span>
        </Form.Label>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() => setExerciseModalOpen(true)}
            sx={searchButtonStyle}
          >
            <strong>Search Exercises</strong>
          </Button>
        </Box>

        <ExerciseSearchModal
          open={exerciseModalOpen}
          onClose={() => setExerciseModalOpen(false)}
          onSelect={handleAddExercise}
          exerciseList={exerciseList}
        />

        <div style={chipContainerStyle}>
          {activityData.workoutExercises.map((exercise, index) => (
            <div key={exercise._id || index} style={chipStyle}>
              <span style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
                {exercise.exerciseName || exercise.name || "Unnamed Exercise"}
              </span>
              {}
              <button
                onClick={() => handleRemoveExercise(index)}
                style={chipButtonStyle}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {errors.workoutExercises && (
          <div style={{ color: "red", marginTop: 4, fontSize: "0.875rem" }}>
            {errors.workoutExercises}
          </div>
        )}

        <div className="createActivityButtons" style={buttonRowStyle}>
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
};

export default ActivityEdit;
