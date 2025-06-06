import { useState, useContext } from "react"; //  sjednocený import
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { UserContext } from "../context/UserContext"; //  kontext
import logo from "../assets/logo.png";

let theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff" },
  },
});
theme = createTheme(theme, {
  palette: { info: { main: theme.palette.secondary.main } },
});

const Register = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext); // ✅ DŮLEŽITÉ – načtení funkce z kontextu

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const existingEmails = ["test@example.com", "johnny.smith@gmail.com"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required!";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address!";
    } else if (existingEmails.includes(formData.email.trim())) {
      newErrors.email = "This email is already in use!";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validateForm()) {
      try {
        const result = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        console.log("✅ Registration result:", result);
        console.log("User registered with data:", formData);

        // ✅ ULOŽENÍ UŽIVATELE A TOKENU
        setCurrentUser(result.user);
        localStorage.setItem("token", result.token);

        alert("Registration successful!");
        navigate("/physical-form"); // ⬅️ Přechod na další krok
      } catch (err) {
        console.error("❌ Registration error:", err);
        setServerError(err.error || "Registration failed.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="createAccount">
        <button id="arrowLeft">
          <Icon path={mdiArrowLeft} size={3} onClick={() => navigate("/")} />
        </button>
        <h1 className="header">Create Your Account</h1>
        <Form.Group className="mb-3">
          <Form.Label>
            Name:<span id="required">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Johnny Smith"
            className="mb-3"
            style={{ width: "300px" }}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>

          <Form.Label>
            Email Address:<span id="required">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="johnny.smith@gmail.com"
            className="mb-3"
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>

          <Form.Label>
            Password:<span id="required">*</span>
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mb-3"
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>

          <Form.Label>
            Confirm Password:<span id="required">*</span>
          </Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mb-3"
            isInvalid={!!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>

          <p id="required">Required *</p>
        </Form.Group>

        {serverError && <p style={{ color: "red" }}>{serverError}</p>}

        <div className="registerButtons" style={{display: "flex", gap: "16px"}}>
          <Button variant="contained" id="signupButton" onClick={handleSubmit}>
            <strong>Sign Up</strong>
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
          Already Have Account?{" "}
          <Button onClick={() => navigate("/login")}>Log In</Button>
        </p>
      </div>
    </ThemeProvider>
  );
};

export default Register;
