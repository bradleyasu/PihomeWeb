import { Assignment, Refresh } from "@mui/icons-material";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import "./TaskEmpty.css";

interface TaskEmptyProps {
    onRefresh: () => void;
}

const TaskEmpty = ({ onRefresh }: TaskEmptyProps) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    
    return (
        <Box className={`task-empty-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <Paper elevation={0} className="task-empty-content">
                <Box className="empty-icon">
                    <Assignment fontSize="large" />
                </Box>
                
                <Typography variant="h5" gutterBottom>
                    No Tasks Found
                </Typography>
                
                <Typography variant="body1" className="empty-description" paragraph>
                    There are currently no tasks to display. Tasks will appear here when they are created.
                </Typography>
                
                <Button 
                    variant={isDarkMode ? "outlined" : "contained"} 
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                    color="primary"
                >
                    Refresh
                </Button>
            </Paper>
        </Box>
    );
};

export default TaskEmpty;
