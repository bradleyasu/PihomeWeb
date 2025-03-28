import "./TaskConfirm.css"
import { Check, Close, Delete } from "@mui/icons-material";
import { IconButton, Tooltip, Box } from "@mui/material";
import { usePiHome } from "../../providers/PihomeStateProvider";

interface TaskProps {
    in_progress: boolean
    task_id: string
}

const TaskConfirm = ({in_progress, task_id}: TaskProps) => {
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
            <Box className="task-action-container">
                <Tooltip title="Delete task">
                    <IconButton 
                        className="task-action-button" 
                        onClick={() => deleteTask(task_id)}
                        size="small"
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }

    return (
        <Box className="task-action-container">
            <Tooltip title="Complete task">
                <IconButton 
                    className="task-action-button confirm" 
                    onClick={() => ackTask(true)}
                    size="medium"
                >
                    <Check />
                </IconButton>
            </Tooltip>
            <Tooltip title="Reject task">
                <IconButton 
                    className="task-action-button reject" 
                    onClick={() => ackTask(false)}
                    size="medium"
                >
                    <Close />
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default TaskConfirm;