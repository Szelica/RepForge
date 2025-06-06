import Icon from "@mdi/react";
import { TextField } from "@mui/material";

export default function ProfileInfoCard({
  icon,
  label,
  value,
  editable,
  field,
  onChange,
  isEditing,
  customInput,
}) {
  return (
    <div
      style={{
        backgroundColor: "#333",
        borderRadius: "8px",
        marginBottom: "15px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        color: "white",
        width: "100%",
        maxWidth: "360px", // 🔥 rovnaká šírka ako navBar (alebo mierne viac)
        marginInline: "auto", // centrovanie
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginRight: "15px",
          backgroundColor: "#c1ff72",
          padding: "10px",
          borderRadius: "6px",
          flexShrink: 0,
        }}
      >
        <Icon path={icon} size={1.2} color="black" />
      </div>
      <div style={{ flex: 1 }}>
        <strong>{label}</strong>
        <br />
        {isEditing && editable ? (
          customInput ? (
            customInput
          ) : (
            <TextField
              size="small"
              variant="standard"
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              sx={{ input: { color: "white" } }}
              fullWidth
            />
          )
        ) : (
          <span>{value || "—"}</span>
        )}
      </div>
    </div>
  );
}
