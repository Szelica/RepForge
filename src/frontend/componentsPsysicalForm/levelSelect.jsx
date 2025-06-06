import React from "react";
import Form from "react-bootstrap/Form";

const LevelSelecter = ({ onChange }) => {
  return (
    <Form.Select onChange={(e) => onChange(e.target.value)}>
      <option value="">choose your fitness level</option>
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Advanced">Advanced</option>
    </Form.Select>
  );
};

export default LevelSelecter;

/*import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Form from 'react-bootstrap/Form';

export default function BasicSelect() {
  const [fitnesLevel, setFitnesslevel] = React.useState("");

  const handleChange = (event) => {
    setFitnesslevel(event.target.value);
  };

  return (
    /*
    <Box sx={{ minWidth: 120, backgroundColor: "white", borderRadius: "5px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">fitness level</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fitnesLevel}
          label="fitness level"
          onChange={handleChange}
        >
          <MenuItem value={10}>Beginner</MenuItem>
          <MenuItem value={20}>Intermediate</MenuItem>
          <MenuItem value={30}>Advaced</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Form.Select id="selectFitnessLevel">
      <option>Beginner</option>
      <option>Intermediate</option>
      <option>Advaced</option>
    </Form.Select>
  );
}
*/
