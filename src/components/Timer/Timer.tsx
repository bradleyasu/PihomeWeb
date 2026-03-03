import "./Timer.css";
import { AccessAlarm } from "@mui/icons-material";

interface Props {
  label: string;
  endTime: number;
  duration: number;
  elapsed: number;
}

const Timer = ({ label, duration, elapsed }: Props) => {
  const remaining = Math.max(0, (duration - elapsed) * 1000);
  const progress = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");
  const timeStr =
    hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  const isUrgent = remaining < 60_000 && remaining > 0;

  return (
    <div className={`timer-card${isUrgent ? " urgent" : ""}`}>
      <div className="timer-header">
        <AccessAlarm className="timer-icon" style={{ fontSize: 14 }} />
        <span className="timer-label">{label}</span>
      </div>
      <div className="timer-time">{timeStr}</div>
      <div className="timer-progress-bar">
        <div
          className="timer-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
