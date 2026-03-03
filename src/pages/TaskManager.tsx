import { useState } from "react";
import { usePiHome } from "../providers/PihomeStateProvider";
import TaskCard from "../components/Task/TaskCard";
import TaskCreator from "../components/Task/TaskCreator";
import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import "./TaskManager.css";

type FilterType = "all" | "in_progress" | "pending";

const TaskManager = () => {
  const pihome = usePiHome();
  const [filter, setFilter] = useState<FilterType>("all");
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const tasks: any[] = pihome?.phstate?.tasks ?? [];

  const activeTasks     = tasks.filter((t) => t.status.toLowerCase() !== "completed");
  const inProgressTasks = tasks.filter((t) => t.status.toLowerCase() === "in_progress");
  const pendingTasks    = tasks.filter(
    (t) => t.status.toLowerCase() !== "in_progress" && t.status.toLowerCase() !== "completed"
  );

  const visibleTasks = (() => {
    switch (filter) {
      case "in_progress": return inProgressTasks;
      case "pending":     return pendingTasks;
      default:            return activeTasks;
    }
  })();

  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (a.status.toLowerCase() === "in_progress" && b.status.toLowerCase() !== "in_progress") return -1;
    if (a.status.toLowerCase() !== "in_progress" && b.status.toLowerCase() === "in_progress") return  1;
    const ta = a.start_time ? new Date(a.start_time).getTime() : 0;
    const tb = b.start_time ? new Date(b.start_time).getTime() : 0;
    return ta - tb;
  });

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: "all",         label: "All",        count: activeTasks.length },
    { id: "in_progress", label: "In Progress", count: inProgressTasks.length },
    { id: "pending",     label: "Pending",     count: pendingTasks.length },
  ];

  return (
    <div className="task-page">

      {/* Stats strip */}
      <div className="task-stats">
        <div className="task-stat">
          <span className="task-stat-num">{tasks.length}</span>
          <span className="task-stat-label">Total</span>
        </div>
        <div className="task-stat-sep" />
        <div className="task-stat">
          <span className="task-stat-num indigo">{activeTasks.length}</span>
          <span className="task-stat-label">Active</span>
        </div>
        <div className="task-stat-sep" />
        <div className="task-stat">
          <span className="task-stat-num cyan">{inProgressTasks.length}</span>
          <span className="task-stat-label">In Progress</span>
        </div>
      </div>

      {/* Filter pills */}
      <div className="task-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            className={"task-filter-pill" + (filter === f.id ? " active" : "")}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="task-filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="task-empty">
            <div className="task-empty-icon">✓</div>
            <p className="task-empty-title">No tasks here</p>
            <p className="task-empty-sub">
              {filter === "all"
                ? "Tap + to create your first task"
                : "Nothing in this category right now"}
            </p>
          </div>
        ) : (
          sortedTasks.map((task: any, i: number) => (
            <TaskCard key={task.id ?? i} task={task} />
          ))
        )}
        <div style={{ height: 88 }} />
      </div>

      {/* FAB */}
      <Fab
        className="task-fab"
        aria-label="add task"
        onClick={() => setIsCreatorOpen(true)}
      >
        <Add />
      </Fab>

      <TaskCreator open={isCreatorOpen} onClose={() => setIsCreatorOpen(false)} />
    </div>
  );
};

export default TaskManager;