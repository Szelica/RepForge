import React from "react";
import Form from "react-bootstrap/Form";

const WorkoutSelecter = ({ onChange }) => {
  return (
    <Form.Select onChange={(e) => onChange(e.target.value)}>
      <option value="">choose your workout style</option>
      <option value="Strength">Strength</option>
      <option value="Cardio">Cardio</option>
      <option value="Mixed">Mixed</option>
    </Form.Select>
  );
};

export default WorkoutSelecter; /*

/*import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Form from 'react-bootstrap/Form';

import FormHelperText from '@mui/material/FormHelperText';

export default function BasicSelect() {
  const [workoutStyle, setworkoutStyle] = React.useState("");

  const handleChange = (event) => {
    setworkoutStyle(event.target.value);
  };

  return (
    /*
    <Box sx={{ minWidth: 120, backgroundColor: "white", borderRadius: "5px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Workout Style</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fitnesLevel}
          label="fitness level"
          onChange={handleChange}
        >
          <MenuItem value={10}>Cardio</MenuItem>
          <MenuItem value={20}>Strength</MenuItem>
        </Select>
      </FormControl>
    </Box>
    */
/*
    <Form.Select id="selectFitnessLevel">
      <option>Cardio</option>
      <option>Strength</option>
    </Form.Select>
  );
}
*/
