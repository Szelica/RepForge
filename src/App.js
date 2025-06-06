import "./frontend/CSS/registerAndLoginStyle.css";
import "./frontend/CSS/dashboardStyle.css";
import "./frontend/CSS/profileStyle.css";
import "./frontend/CSS/createExerciseStyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import signingImage from "./assets/signing.jpg";
import logo from "./assets/logo.png";

import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";

import Register from "./frontend/register.jsx";
import PhysicalForm from "./frontend/physicalForm.jsx";
import Login from "./frontend/loginForm.jsx";
import Dashboard from "./frontend/dashboard.jsx";
import Profile from "./frontend/profile.jsx";
import NavBar from "./frontend/navBar.jsx";
import AddActivity from "./frontend/addActivity.jsx";
import Workout from "./frontend/workout.jsx";
import Exercise from "./frontend/exercise.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "./frontend/components/ProtectedRoute.jsx";
import { setToken } from "./frontend/utils/auth.js";

let theme = createTheme({
  palette: {
    primary: {
      main: "#c1ff72",
      dark: "#4d4d4d",
    },
    secondary: {
      main: "#ffffff",
      dark: "#000000",
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if(token){
    setToken(token);
  }

  return (
    <ThemeProvider theme={theme}>
  <div className="home-page">
    <div className="left-panel">
      <img src={logo} alt="Logo" className="logo" />

      <div className="home-text">
        <h1>CREATE YOUR<br />OWN JOURNEY TO<br />GOOD HEALTH</h1>
      </div>

      <div className="home-buttons">
        <Button
          variant="contained"
          id="signUpButton"
          onClick={() => navigate("/register")}
          sx={{ backgroundColor: "#c1ff72", color: "#000" }}
        >
          <strong>SIGN UP NOW</strong>
        </Button>
        <p>Already Have Account?</p>
        <Button
          variant="contained"
          id="loginButton"
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: "#4d4d4d",
            color: "#fff",
            marginTop: "10px",
          }}
        >
          <strong>LOGIN</strong>
        </Button>
      </div>
    </div>

    <div className="right-panel">
      <img src={signingImage} alt="Fitness" className="signing-image" />
    </div>
  </div>
</ThemeProvider>
  );
}

function Layout() {
  const location = useLocation();
  const showNavBar = [
    "/dashboard",
    "/profile",
    "/workout",
    "/exercise",
  ].includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Home must be public */}
        <Route path="/" element={<Home />} />

        {/* Login/Register must be public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* All others are protected */}
        <Route
          path="/physical-form"
          element={
            <ProtectedRoute>
              <PhysicalForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addActivity"
          element={
            <ProtectedRoute>
              <AddActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise"
          element={
            <ProtectedRoute>
              <Exercise />
            </ProtectedRoute>
          }
        />
      </Routes>

      {showNavBar && <NavBar />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
