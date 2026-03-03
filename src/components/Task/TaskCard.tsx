import { AccessTime, Check, Close, Delete } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { usePiHome } from "../../providers/PihomeStateProvider";
import "./TaskCard.css";

type TaskType = {
  id: string;
  name: string;
  description: string;
  start_time: string;
  status: string;
  priority: string;
};

interface TaskProps {
  task: TaskType;
}

const priorityColor = (p: string) => {
  switch (p?.toLowerCase()) {
    case "high":   return "#ff5252";
    case "medium": return "#ffab40";
    case "low":    return "#69f0ae";
    default:       return "#64748b";
  }
};

const statusLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatTime = (t: string) => {
  if (!t) return null;
  try {
    const d = new Date(t);
    if (isNaN(d.getTime())) return t;
    return d.toLocaleString(undefined, {
      month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  } catch { return t; }
};

const TaskCard = ({ task }: TaskProps) => {
  const pihome = usePiHome();
  const isInProgress = task.status.toLowerCase() === "in_progress";
  const pColor = priorityColor(task.priority);

  const handleDelete = () => {
    pihome.send_payload({ type: "delete", entity: "task", id: task.id });
  };

  const handleConfirm = () => {
    pihome.send_payload({ type: "acktask", confirm: true });
  };

  const handleReject = () => {
    pihome.send_payload({ type: "acktask", confirm: false });
  };

  const formattedTime = formatTime(task.start_time);

  return (
    <div
      className={"task-card" + (isInProgress ? " task-card--active" : "")}
      style={{ "--priority-color": pColor } as React.CSSProperties}
    >
      {/* Left priority bar */}
      <div className="task-card-bar" />

      {/* Card body */}
      <div className="task-card-body">

        {/* Top row: name + status chip */}
        <div className="task-card-top">
          <span className="task-card-name">{task.name || "Unnamed Task"}</span>
          <span
            className={
              "task-card-status" +
              (isInProgress ? " task-card-status--active" : "")
            }
          >
            {statusLabel(task.status)}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}

        {/* Bottom row: time + actions */}
        <div className="task-card-footer">
          {formattedTime && (
            <span className="task-card-time">
              <AccessTime sx={{ fontSize: 12, verticalAlign: "middle", mr: "3px" }} />
              {formattedTime}
            </span>
          )}

          <div className="task-card-actions">
            {isInProgress ? (
              <>
                <Tooltip title="Complete">
                  <button
                    className="task-action-btn task-action-btn--confirm"
                    onClick={handleConfirm}
                  >
                    <Check sx={{ fontSize: 14 }} />
                  </button>
                </Tooltip>
                <Tooltip title="Reject">
                  <button
                    className="task-action-btn task-action-btn--reject"
                    onClick={handleReject}
                  >
                    <Close sx={{ fontSize: 14 }} />
                  </button>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Delete">
                <button
                  className="task-action-btn task-action-btn--delete"
                  onClick={handleDelete}
                >
                  <Delete sx={{ fontSize: 14 }} />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
