import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#2c2c2c",
  color: "white",
  padding: 4,
  borderRadius: 2,
  width: "90%",
  maxWidth: 400,
  textAlign: "center",
};

export default function WarningModal({ open, text, leftButton, rightButton }) {
  return (
    <Modal
      open={open}
      onClose={() => {}}
      disableEscapeKeyDown
      slotProps={{ backdrop: { onClick: (e) => e.stopPropagation() } }}
    >
      <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" gutterBottom sx={{ color: "#ffc107" }}>
          ⚠️ Warning
        </Typography>

        <Typography sx={{ mb: 3 }}>{text}</Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white" }}
            onClick={leftButton.onClick}
          >
            {leftButton.label}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#c1ff72", color: "#000", fontWeight: "bold" }}
            onClick={rightButton.onClick}
          >
            {rightButton.label}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}


