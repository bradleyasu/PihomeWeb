import { Assignment, AssignmentLate, AssignmentTurnedIn } from "@mui/icons-material";
import { Box, Divider, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import "./TasksSummary.css";

interface TasksSummaryProps {
    totalTasks: number;
    activeTasks: number;
    inProgressTasks: number;
}

const TasksSummary = ({ totalTasks, activeTasks, inProgressTasks }: TasksSummaryProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';

    if (isMobile) {
        // Compact layout for mobile
        return (
            <Paper className={`summary-compact ${isDarkMode ? 'dark-mode' : ''}`}>
                <Box className="summary-stat">
                    <Box className="stat-icon-wrapper blue">
                        <Assignment fontSize="small" />
                    </Box>
                    <Box className="stat-content">
                        <Typography variant="h6">{totalTasks}</Typography>
                        <Typography variant="caption">Total</Typography>
                    </Box>
                </Box>
                
                <Divider orientation="vertical" flexItem className="summary-divider" />
                
                <Box className="summary-stat">
                    <Box className="stat-icon-wrapper orange">
                        <AssignmentLate fontSize="small" />
                    </Box>
                    <Box className="stat-content">
                        <Typography variant="h6">{activeTasks}</Typography>
                        <Typography variant="caption">Active</Typography>
                    </Box>
                </Box>
                
                <Divider orientation="vertical" flexItem className="summary-divider" />
                
                <Box className="summary-stat">
                    <Box className="stat-icon-wrapper green">
                        <AssignmentTurnedIn fontSize="small" />
                    </Box>
                    <Box className="stat-content">
                        <Typography variant="h6">{inProgressTasks}</Typography>
                        <Typography variant="caption">In Progress</Typography>
                    </Box>
                </Box>
            </Paper>
        );
    }

    // Original layout for desktop
    return (
        <Box className="summary-container">
            <Paper className={`summary-card total ${isDarkMode ? 'dark-mode' : ''}`}>
                <Box className="summary-icon-wrapper blue">
                    <Assignment fontSize={isMobile ? "small" : "medium"} />
                </Box>
                <Box className="summary-content">
                    <Typography variant={isMobile ? "h6" : "h5"}>{totalTasks}</Typography>
                    <Typography variant="body2">Total Tasks</Typography>
                </Box>
            </Paper>

            <Paper className={`summary-card active ${isDarkMode ? 'dark-mode' : ''}`}>
                <Box className="summary-icon-wrapper orange">
                    <AssignmentLate fontSize={isMobile ? "small" : "medium"} />
                </Box>
                <Box className="summary-content">
                    <Typography variant={isMobile ? "h6" : "h5"}>{activeTasks}</Typography>
                    <Typography variant="body2">Active Tasks</Typography>
                </Box>
            </Paper>

            <Paper className={`summary-card in-progress ${isDarkMode ? 'dark-mode' : ''}`}>
                <Box className="summary-icon-wrapper green">
                    <AssignmentTurnedIn fontSize={isMobile ? "small" : "medium"} />
                </Box>
                <Box className="summary-content">
                    <Typography variant={isMobile ? "h6" : "h5"}>{inProgressTasks}</Typography>
                    <Typography variant="body2">In Progress</Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default TasksSummary;
