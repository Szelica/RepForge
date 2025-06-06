import React from "react";
import { Card as MuiCard, CardContent, Typography, Divider, CardActions, Button } from "@mui/material";

export default function Card({ header, children, firstButton, secondButton }) {
  return (
    <MuiCard
      sx={{
        backgroundColor: "#4d4d4d",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
      variant="outlined"
    >
      {/* Header */}
      {header && (
        <CardContent sx={{ backgroundColor: "#3a3a3a", paddingBottom: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#c1ff72" }}>
            {header}
          </Typography>
          <Divider sx={{ marginTop: 1, backgroundColor: "#c1ff72" }} />
        </CardContent>
      )}

      {/* Body */}
      <CardContent sx={{ flexGrow: 1, paddingTop: 2 }}>
        {children}
      </CardContent>

      {/* Footer */}
      {(firstButton || secondButton) && (
        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          {firstButton && (
            <Button
              variant="outlined"
              size="small"
              sx={{ color: "white", borderColor: "white" }}
              onClick={firstButton.onClick}
            >
              {firstButton.label}
            </Button>
          )}
          {secondButton && (
            <Button
              variant="outlined"
              size="small"
              sx={{ color: "white", borderColor: "white" }}
              onClick={secondButton.onClick}
            >
              {secondButton.label}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  );
}