import "./Task.css"
import TaskConfirm from "./TaskConfirm"

type TaskType = {
    id: string,
    name: string,
    description: string
    start_time: string,
    status: string,
    priority: string
}

interface TaskProps {
    task: TaskType
}

const Task = ({task}: TaskProps) => {

    return (
        <div 
            className="task"
            style={task.status.toLowerCase() === "in_progress" ? {
                backgroundColor: "#00aaff50",
                color: "white",
                border: "1px solid #00aaff"
            } : {}}
        >
            <div className="task-top">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
            </div>
            <TaskConfirm in_progress={task.status.toLowerCase() === "in_progress"} task_id={task.id} />
            <div className="task-bottom">
                <p>{task.start_time}</p>
                <p>{task.status}</p>
                <p>
                    <div className={`led-${task.priority.toLowerCase()}`} />
                </p>
            </div>
        </div>
    )
}

export default Task;