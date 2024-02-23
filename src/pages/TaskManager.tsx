import { render } from "@testing-library/react";
import { usePiHome } from "../providers/PihomeStateProvider";
import "./TaskManager.css";
import { Container } from "@mui/material";
import Task from "../components/Task/Task";

const TaskManager = () => {
    const pihome = usePiHome();
    const tasks = pihome?.phstate?.tasks;

    if (!tasks) {
        return (
            <div
                className={"task_manager_container"}
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
            {tasks.map((task: any, index: number) => {
                return (
                    <Task key={index} task={task} />
                )
            })}

        </div>
    )
}

export default TaskManager;