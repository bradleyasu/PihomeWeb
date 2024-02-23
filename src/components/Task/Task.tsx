import "./Task.css"

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
        <div className="task">
            <div className="task-top">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
            </div>
            <div className="task-bottom">
                <p>{task.start_time}</p>
                <p>{task.status}</p>
                <p>{task.priority}</p>
            </div>

        </div>
    )
}

export default Task;