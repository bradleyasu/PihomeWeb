import Timer from "../components/Timer/Timer";
import { usePiHome } from "../providers/PihomeStateProvider";
import "./Timers.css";
import { Button, TextField, Typography, Box } from "@mui/material";
import { AccessAlarm, Add } from "@mui/icons-material";
import { useState } from "react";

const Timers = () => {
  const pihome = usePiHome();
  const timers: any[] = pihome?.phstate?.timers ?? [];
  const [label, setLabel] = useState("");
  const [duration, setDuration] = useState("");

  const handleCreate = () => {
    const mins = parseFloat(duration) || 1;
    if (!label.trim()) return;
    pihome.send_payload({
      type: "timer",
      label: label.trim(),
      duration: Math.round(mins * 60),
    });
    setLabel("");
    setDuration("");
  };

  return (
    <div className="timers-page">
      {/* Create timer form */}
      <div className="new-timer-card">
        <span className="new-timer-title">New Timer</span>
        <div className="new-timer-form">
          <TextField
            size="small"
            label="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.05)",
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
            }}
          />
          <TextField
            size="small"
            label="Duration (min)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            inputProps={{ min: 0.5, step: 0.5 }}
            sx={{
              maxWidth: 140,
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.05)",
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            disabled={!label.trim() || !duration}
            sx={{
              background: "linear-gradient(135deg, #818cf8, #22d3ee)",
              color: "white",
              fontWeight: 600,
              borderRadius: "10px",
              whiteSpace: "nowrap",
              "&:hover": {
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              },
              "&.Mui-disabled": { opacity: 0.4 },
            }}
          >
            Start Timer
          </Button>
        </div>
      </div>

      {/* Timer grid */}
      {timers.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            opacity: 0.4,
          }}
        >
          <AccessAlarm sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            No active timers
          </Typography>
        </Box>
      ) : (
        <div className="timers-grid">
          {timers.map((t: any, i: number) => (
            <Timer
              key={t.id ?? i}
              label={t.label ?? "Timer"}
              endTime={t.end_time ?? 0}
              duration={t.duration ?? 0}
              elapsed={t.elapsed ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Timers;
