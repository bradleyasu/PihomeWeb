import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import "./Task.css";
import TaskConfirm from "./TaskConfirm";
import { AccessTime, Flag } from "@mui/icons-material";

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
    const isInProgress = task.status.toLowerCase() === "in_progress";
    
    const getPriorityColor = (priority: string) => {
        switch(priority.toLowerCase()) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            case 'low': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    return (
        <Card 
            className={`task ${isInProgress ? 'task-in-progress' : ''}`}
            elevation={3}
        >
            <CardContent>
                <Box className="task-header">
                    <Typography variant="h6" className="task-title">{task.name}</Typography>
                    <Chip 
                        icon={<Flag />}
                        label={task.priority}
                        size="small"
                        className="priority-chip"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                    />
                </Box>
                
                <Typography variant="body2" className="task-description">
                    {task.description}
                </Typography>
                
                <TaskConfirm in_progress={isInProgress} task_id={task.id} />
                
                <Box className="task-footer">
                    <Box className="task-time">
                        <AccessTime fontSize="small" />
                        <Typography variant="caption">{task.start_time}</Typography>
                    </Box>
                    <Chip 
                        label={task.status.replace('_', ' ')}
                        size="small"
                        color={isInProgress ? "primary" : "default"}
                        className="status-chip"
                    />
                </Box>
            </CardContent>
        </Card>
    )
}

export default Task;