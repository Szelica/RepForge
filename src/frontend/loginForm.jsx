import { useState, useContext } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.png";

const theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff" },
    info: { main: "#ffffff" },
  },
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address!";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      try {
        console.log("Login using API_URL:", process.env.REACT_APP_API_URL);
        const result = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        if (result.user) {
          // 🔧 Use the same storage as registration
          localStorage.setItem("token", result.token); // changed from sessionStorage
          setCurrentUser(result.user); //Save user with _id from MongoDB
          alert("Login successful!");
          navigate("/dashboard");
        } else {
          setServerError("Login failed. User not found.");
        }
      } catch (err) {
        setServerError(err.error || "Login failed.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="createAccount">
        <button id="arrowLeft" onClick={() => navigate("/")}>
          <Icon path={mdiArrowLeft} size={3} />
        </button>
        <h1 className="header">Login To Your Account</h1>

        <Form.Group className="mb-3">
          <Form.Label>Email Address:<span id="required">*</span></Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johnny.smith@gmail.com"
            style={{ width: "300px" }}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>

          <Form.Label>Password:<span id="required">*</span></Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>

          <p id="required">Required *</p>
        </Form.Group>

        <div className="loginButtons" style={{display: "flex", gap: "16px"}}>
          <Button variant="contained" id="loginButton" onClick={handleSubmit}>
            <strong>Sign In</strong>
          </Button>
        
          <button className="gsi-material-button">
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </div>
              <span className="gsi-material-button-contents">Google</span>
              <span style={{ display: "none" }}>Sign in with Google</span>
            </div>
          </button>
        </div>
        <p>
          Don't have an account yet?{" "}
          <Button onClick={() => navigate("/register")}>Sign Up</Button>
        </p>

        {serverError && <p style={{ color: "red", marginTop: "10px" }}>{serverError}</p>}
      </div>
    </ThemeProvider>
  );
};

export default LoginForm;