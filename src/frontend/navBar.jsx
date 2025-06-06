import * as React from "react";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Icon from "@mdi/react";

import { useNavigate, useLocation } from "react-router-dom"; // ✅ already imported

import { mdiAccount, mdiDumbbell, mdiGymnastics, mdiHome } from "@mdi/js";

let theme = createTheme({
  palette: {
    primary: { main: "#c1ff72", dark: "#4d4d4d", white: "#000000" },
    secondary: { main: "#ffffff", dark: "#4d4d4d" },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current path
  const pages = ["/dashboard", "/exercise", "/workout", "/profile"];
  
  // ✅ derive initial value from current path
  const initialIndex = pages.indexOf(location.pathname);
  const [value, setValue] = React.useState(initialIndex !== -1 ? initialIndex : 0);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "90%",
          maxWidth: "400px",
          position: "fixed",
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#333",
          zIndex: 1,
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(pages[newValue]);
          }}
          sx={{ backgroundColor: "transparent", borderRadius: "20px" }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<Icon path={mdiHome} size={1.5} />}
            sx={{
              color: value === 0 ? "primary.main" : "white",
            }}
          />
          <BottomNavigationAction
            label="Exercise"
            icon={<Icon path={mdiDumbbell} size={1.5} />}
            sx={{
              color: value === 1 ? "primary.main" : "white",
            }}
          />
          <BottomNavigationAction
            label="Workout"
            icon={<Icon path={mdiGymnastics} size={1.5} />}
            sx={{
              color: value === 2 ? "primary.main" : "white",
            }}
          />
          <BottomNavigationAction
            label="Profile"
            icon={<Icon path={mdiAccount} size={1.5} />}
            sx={{
              color: value === 3 ? "primary.main" : "white",
            }}
          />
        </BottomNavigation>
      </Box>
    </ThemeProvider>
  );
}
