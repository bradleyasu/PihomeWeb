import "./TaskConfirm.css"
import CheckIcon from '@mui/icons-material/Check';
import { Close } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { usePiHome } from "../../providers/PihomeStateProvider";

interface TaskProps {
    in_progress: boolean
    task_id: string
}

const Task = ({in_progress, task_id}: TaskProps) => {
    const pihome = usePiHome();

    const ackTask = (isConfirmed: boolean) => {
        pihome?.send_payload({
            type: "acktask",
            confirm: isConfirmed
        })
    }

    const deleteTask = (task_id: string) => {
        pihome?.send_payload({
            type: "delete",
            entity: "task",
            id: task_id
        })
    }

    if (!in_progress) {
        return (
        <div className="task-confirm-container">
            <div className="task-confirm-btn" style={{borderColor: '#424242'}}
                onClick={() => deleteTask(task_id)}
            >
                <Delete />
            </div>
        </div>

        )
    }

    return (
        <div className="task-confirm-container">
            <div className="task-confirm-btn" style={{borderColor: 'green'}}
            onClick={() => ackTask(true)}
            >
                <CheckIcon />
            </div>
            <div className="task-confirm-btn" style={{borderColor: 'red'}}
                onClick={() => ackTask(false)}
            >
                <Close />
            </div>
        </div>
    )
}

export default Task;