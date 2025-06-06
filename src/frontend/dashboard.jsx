import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { UserContext } from "../context/UserContext.js";
import {
  fetchActivities,
  deleteActivity,
} from "../services/activityService.js";
import { fetchWorkouts } from "../services/workoutService.js";
import { fetchExercises } from "../services/exerciseService.js";
import Header from "./components/Header.jsx";
import Card from "./components/Card.jsx";
import PhysicalForm from "./componentsDashboard/activityEdit.jsx";
import WarningModal from "./components/WarningModal.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff", dark: "#4d4d4d" },
    info: { main: "#ffffff" },
  },
});

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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
};

export default function Dashboard() {
  const { currentUser } = useContext(UserContext);
  const [activities, setActivities] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadWorkouts();
      loadExercises().then(() => {
        loadActivities();
      });
    }
  }, [currentUser]);

  const loadActivities = async () => {
    try {
      const data = await fetchActivities(currentUser._id);
      setActivities(data);
    } catch (err) {
      console.error("Failed to load activities:", err);
    }
  };

  const loadWorkouts = async () => {
    try {
      const data = await fetchWorkouts(currentUser._id);
      setWorkouts(data);
    } catch (err) {
      console.error("Failed to load workouts:", err);
    }
  };

  const loadExercises = async () => {
    try {
      const data = await fetchExercises(currentUser._id);
      setExercises(data);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    }
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      await loadActivities();
    } catch (err) {
      console.error("Failed to delete activity:", err);
      alert("Failed to delete activity.");
    }
  };

  const confirmDeleteActivity = async () => {
    if (!activityToDelete) return;
    try {
      await deleteActivity(activityToDelete._id);
      await loadActivities();
    } catch (err) {
      console.error("Faild to delete activity:", err);
      alert("Failed to delete activity.");
    } finally {
      setActivityToDelete(null);
      setShowDeleteWarning(false);
    }
  };

  const cancelDeleteActivity = () => {
    setActivityToDelete(null);
    setShowDeleteWarning(false);
  }

  const filteredActivities = selectedDate
    ? activities.filter((activity) => {
        const activityDate = new Date(activity.date).toDateString();
        return activityDate === selectedDate.toDate().toDateString();
      })
    : activities;

  return (
    <ThemeProvider theme={theme}>
      <div className="dashboard">
        <Header />

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              maxDate={dayjs()}
              sx={{
                backgroundColor: "#c1ff72",
                borderRadius: 1,
                mr: 2,
              }}
            />
          </LocalizationProvider>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c1ff72",
              color: "#000",
              fontWeight: "bold",
            }}
            onClick={handleAddActivity}
          >
            <strong>Add Activity</strong>
          </Button>
        </Box>

        {selectedDate && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography sx={{ color: "#c1ff72", fontSize: 20 }}>
              Your activity on {selectedDate.format("DD.MM.YYYY")}
            </Typography>
            <Button
              variant="text"
              onClick={() => setSelectedDate(null)}
              sx={{ color: "#c1ff72", textDecoration: "underline" }}
            >
              Show all activities
            </Button>
          </Box>
        )}

        <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
          <Box sx={{ maxWidth: 1200, width: "100%" }}>
            {filteredActivities.length === 0 ? (
              <Typography sx={{ color: "white", textAlign: "center", mt: 5 }}>
                No activities found {selectedDate ? "for selected date." : "."}
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                {filteredActivities.map((activity) => (
                  <Box key={activity._id} sx={{ width: 320 }}>
                    <Card
                      header={activity.name}
                      firstButton={{
                        label: "Edit",
                        onClick: () => handleEditActivity(activity),
                      }}
                      secondButton={{
                        label: <DeleteIcon />,
                        onClick: () => {
                        setActivityToDelete(activity);
                        setShowDeleteWarning(true);
                      }
                      }}
                    >
                      <Typography>
                        <strong>Date:</strong> {activity.date}
                      </Typography>
                      <Typography>
                        <strong>Time:</strong> {activity.time}
                      </Typography>
                      <Typography>
                        <strong>Duration:</strong> {activity.duration}
                      </Typography>
                      <Typography>
                        <strong>Repetitions:</strong>{" "}
                        {activity.repetitions || "-"}
                      </Typography>
                      <Typography>
                        <strong>Workout:</strong>{" "}
                        {workouts.find(
                          (w) => String(w._id) === String(activity.workoutId)
                        )?.name || "-"}
                      </Typography>
                      {activity.note && (
                        <Typography>
                          <strong>Note:</strong> {activity.note}
                        </Typography>
                      )}
                      <Typography sx={{ mt: 2 }}>
                        <strong>Exercises linked:</strong>{" "}
                        {activity.exercises?.length || 0}
                      </Typography>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Modal
          open={isModalOpen}
          onClose={(event, reason) => {
            if (reason === "backdropClick") return;
            setIsModalOpen(false);
          }}
          disableEscapeKeyDown
        >
          <Box sx={modalStyle}>
            <PhysicalForm
              activity={selectedActivity}
              onClose={() => setIsModalOpen(false)}
              onUpdate={async () => {
                await loadActivities();
                setIsModalOpen(false);
              }}
            />
          </Box>
        </Modal>
      </div>
      <WarningModal
        open={showDeleteWarning}
        text={`Do you really want to delete "${activityToDelete?.name}"?`}
        leftButton={{ label: "Cancel", onClick: cancelDeleteActivity }}
        rightButton={{ label: "Delete", onClick: confirmDeleteActivity }}
      />
    </ThemeProvider>
  );
}
