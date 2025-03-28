import { 
    AccessTime, 
    Delete, 
    DoneAll, 
    Error, 
    PendingActions, 
    PriorityHigh 
} from "@mui/icons-material";
import { 
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    Chip, 
    Divider, 
    IconButton, 
    Tooltip, 
    Typography,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { usePiHome } from "../../providers/PihomeStateProvider";
import "./TaskCard.css";

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

const TaskCard = ({ task }: TaskProps) => {
    const pihome = usePiHome();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';
    
    const isInProgress = task.status.toLowerCase() === "in_progress";

    const getStatusIcon = () => {
        switch(task.status.toLowerCase()) {
            case 'in_progress': return <PendingActions fontSize={isMobile ? "small" : "medium"} />;
            case 'pending': return <AccessTime fontSize={isMobile ? "small" : "medium"} />;
            default: return <AccessTime fontSize={isMobile ? "small" : "medium"} />;
        }
    };

    const getPriorityColor = () => {
        switch(task.priority.toLowerCase()) {
            case 'high': return isDarkMode ? '#ff5252' : '#f44336';
            case 'medium': return isDarkMode ? '#ffab40' : '#ff9800';
            case 'low': return isDarkMode ? '#69f0ae' : '#4caf50';
            default: return isDarkMode ? '#bdbdbd' : '#9e9e9e';
        }
    };

    const handleTaskAction = (action: 'confirm' | 'reject' | 'delete') => {
        if (action === 'delete') {
            pihome.send_payload({
                type: "delete",
                entity: "task",
                id: task.id
            });
        } else {
            pihome.send_payload({
                type: "acktask",
                confirm: action === 'confirm'
            });
        }
    };

    return (
        <Card className={`task-card ${isInProgress ? 'in-progress' : ''} ${isDarkMode ? 'dark-mode' : ''}`}>
            <Box className="task-header">
                <Chip 
                    icon={getStatusIcon()} 
                    label={task.status.replace('_', ' ')}
                    color={isInProgress ? "primary" : "default"}
                    size="small"
                    className="status-chip"
                />
                
                <Box className="priority-indicator" style={{ backgroundColor: getPriorityColor() }}>
                    <Tooltip title={`${task.priority} Priority`}>
                        <PriorityHigh fontSize="small" />
                    </Tooltip>
                </Box>
            </Box>
            
            <CardContent className="task-content">
                <Typography variant="h6" className="task-title">
                    {task.name}
                </Typography>
                
                <Typography variant="body2" className="task-description">
                    {task.description}
                </Typography>
                
                <Box className="task-metadata">
                    <Tooltip title="Start time">
                        <Box className="metadata-item">
                            <AccessTime fontSize="small" />
                            <Typography variant="caption">{task.start_time}</Typography>
                        </Box>
                    </Tooltip>
                </Box>
            </CardContent>
            
            <Divider className="task-divider" />
            
            <CardActions className="task-actions">
                {isInProgress ? (
                    <>
                        <Button 
                            variant={isDarkMode ? "outlined" : "contained"} 
                            color="success" 
                            startIcon={<DoneAll />}
                            onClick={() => handleTaskAction('confirm')}
                            fullWidth
                            size={isMobile ? "small" : "medium"}
                        >
                            Complete
                        </Button>
                        <Button 
                            variant={isDarkMode ? "outlined" : "outlined"} 
                            color="error"
                            startIcon={<Error />}
                            onClick={() => handleTaskAction('reject')}
                            fullWidth
                            size={isMobile ? "small" : "medium"}
                        >
                            Reject
                        </Button>
                    </>
                ) : (
                    <>
                        <Box sx={{ flexGrow: 1 }} />
                        <Tooltip title="Delete Task">
                            <IconButton 
                                onClick={() => handleTaskAction('delete')}
                                className="delete-button"
                                size={isMobile ? "small" : "medium"}
                            >
                                <Delete fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </CardActions>
        </Card>
    );
};

export default TaskCard;
