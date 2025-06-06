/// tato stránka je již implementována jako modalové okno v souboru exersice.jsx
//aktuálně v programu nikde není volána

/*
import { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router-dom";

let theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d" },
    secondary: { main: "#ffffff", light: "" },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

const CreateExerciseForm = () => {
  const navigate = useNavigate();
  const [exerciseData, setFormData] = useState({
    name: "",
    instruction: "",
    muscleGroup: "",
    typeOfExercise: "Strength",
    difficultyLevel: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...exerciseData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!exerciseData.name.trim()) {
      newErrors.name = "Name of the exercise is reqired!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (validateForm()) {
      
          try{
            const result = await createExercise({
              name: exerciseData.name,
            });
            
      //console.log(result);
      alert("Exercise created successfuly!");
      navigate("/dashboard");
    } catch(err){
            setServerError(err.error || "Login failed.");
          }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="createExercise">
        <h1 className="createExerciseHeader">Create your exercise</h1>
        <Form.Group className="mb-3">
          <Form.Label>
            Name:<span id="required">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            id="exerciseName"
            placeholder="Pull up"
            className="mb-3"
            isInvalid={!!errors.name}
            value={exerciseData.name}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>

          <Form.Label>Instructions:</Form.Label>
          <Form.Control
            as="textarea"
            rown={3}
            name="exerciseInstructions"
            id="exerciseInstructions"
            className="mb-3"
          />

          <Form.Label>Muscle group:</Form.Label>
          <Form.Select
            aria-label="Default select example"
            name="muscleGroup"
            id="muscleGroup"
          >
            <option> - Choose Muscle Group -</option>
            <option value="1">Abs</option>
            <option value="2">Biceps</option>
            <option value="3">Calves</option>
            <option value="4">Chest</option>
            <option value="5">Forearms</option>
            <option value="6">Glutes</option>
            <option value="7">Hamstrings</option>
            <option value="8">Lats</option>
            <option value="9">Lower Back</option>
            <option value="10">Middle Back</option>
            <option value="11">Shoulders</option>
            <option value="12">Quadriceps</option>
            <option value="14">Traps</option>
            <option value="15">Triceps</option>
          </Form.Select>

          <FormControl
            component="fieldset"
            className="mb-3"
            style={{ display: "block", paddingTop: "10px" }}
          >
            <FormLabel component="legend" style={{ color: "#ffffff" }}>
              Type of Exercise
            </FormLabel>
            <RadioGroup
              row
              name="typeOfExercise"
              id="typeOfExercise"
              value={exerciseData.typeOfExercise}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Strength"
                control={
                  <Radio
                    sx={{
                      color: "#ffffff",
                      "&.Mui-checked": {
                        color: "#c1ff72",
                      },
                    }}
                  />
                }
                label="Strength"
              />
              <FormControlLabel
                value="Cardio"
                control={
                  <Radio
                    sx={{
                      color: "#ffffff",
                      "&.Mui-checked": {
                        color: "#c1ff72",
                      },
                    }}
                  />
                }
                label="Cardio"
              />
            </RadioGroup>
          </FormControl>

          <Form.Label>Difficulty level:</Form.Label>
          <Form.Select
            aria-label="Default select example"
            name="difficultyLevel"
            id="difficultyLevel"
          >
            <option>- Choose Difficulty -</option>
            <option value="1">Beginner</option>
            <option value="2">Intermediate</option>
            <option value="3">Advanced</option>
          </Form.Select>
        </Form.Group>

        <div className="createExerciseButtons">
          <Button
            variant="contained"
            id="cancelCreationButton"
            name="cancelCreationButton"
            onClick={() => navigate("/dashboard")}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.dark,
              color: "#ffffff",
            }}
          >
            <strong>Cancel</strong>
          </Button>
          <Button
            variant="contained"
            id="createExerciseButton"
            name="createExerciseButton"
            onClick={handleSubmit}
          >
            <strong>Create</strong>
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CreateExerciseForm;

*/