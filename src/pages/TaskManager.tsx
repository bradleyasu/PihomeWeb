import { usePiHome } from "../providers/PihomeStateProvider";
import "./TaskManager.css";
import Task from "../components/Task/Task";

const TaskManager = () => {
    const pihome = usePiHome();
    const tasks = pihome?.phstate?.tasks;

    if (!tasks || tasks.length === 0) {
        return (
            <div
                className={"task_manager_error"}
            >
                <h1>Task Manager</h1>
                <p>No tasks found</p>
            </div>
        )
    }

    return (
        <div
            className={"task_manager_container"}
        >
            {tasks
            .filter((task: any) => task.status.toLowerCase() !== "completed")
            .sort((a: any, b: any) => {
                // We want the in_progress tasks to be at the top
                if (a.status.toLowerCase() === "in_progress") {
                    return -1;
                }
            })
            .map((task: any, index: number)=> {
                return (
                    <Task key={index} task={task} />
                )
            })}
        </div>
    )
}

export default TaskManager;