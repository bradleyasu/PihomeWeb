import { usePiHome } from "../providers/PihomeStateProvider";
import "./TaskManager.css";
import TaskCard from "./../components/Task/TaskCard";
import { Box, Divider, Fab, Paper, Tab, Tabs, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import TasksSummary from "./../components/Task/TasksSummary";
import { Add, Refresh } from "@mui/icons-material";
import TaskEmpty from "./../components/Task/TaskEmpty";
import TaskCreator from "../components/Task/TaskCreator";

const TaskManager = () => {
    const pihome = usePiHome();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';
    const taskGridRef = useRef<HTMLDivElement>(null);
    
    const tasks = pihome?.phstate?.tasks || [];
    const [tabValue, setTabValue] = useState(0);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [prevTabValue, setPrevTabValue] = useState(tabValue);
    
    // Process tasks into categories
    const activeTasks = tasks.filter((task: any) => 
        task.status.toLowerCase() !== "completed");
    const inProgressTasks = tasks.filter((task: any) => 
        task.status.toLowerCase() === "in_progress");
    const pendingTasks = tasks.filter((task: any) => 
        task.status.toLowerCase() !== "in_progress" && 
        task.status.toLowerCase() !== "completed");
    
    useEffect(() => {
        // Set filtered tasks based on current tab
        if (tabValue === 0) setFilteredTasks(activeTasks);
        else if (tabValue === 1) setFilteredTasks(inProgressTasks);
        else if (tabValue === 2) setFilteredTasks(pendingTasks);
        
        // Only scroll to top when tab changes, not when tasks update
        if (tabValue !== prevTabValue && taskGridRef.current) {
            taskGridRef.current.scrollTop = 0;
            setPrevTabValue(tabValue);
        }
    }, [tabValue, tasks, prevTabValue]);

    const handleRefresh = () => {
        pihome.send_payload({
            type: "status",
            force: true
        });
    };

    const sortTasksByTime = (tasks: any[]) => {
        return [...tasks].sort((a, b) => {
            // First sort by in-progress status
            if (a.status.toLowerCase() === "in_progress" && b.status.toLowerCase() !== "in_progress") {
                return -1;
            }
            if (a.status.toLowerCase() !== "in_progress" && b.status.toLowerCase() === "in_progress") {
                return 1;
            }
            
            // Then sort by proximity to current time
            const timeA = parseTaskTime(a.start_time);
            const timeB = parseTaskTime(b.start_time);
            
            // If both have valid times, sort by time proximity
            if (timeA && timeB) {
                return timeA.getTime() - timeB.getTime();
            }
            
            // If only one has a valid time, that one comes first
            if (timeA) return -1;
            if (timeB) return 1;
            
            // Fall back to priority if times can't be compared
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            // const priorityA = priorityOrder[a.priority.toLowerCase()] || 99;
            // const priorityB = priorityOrder[b.priority.toLowerCase()] || 99;
            // return priorityA - priorityB;
            return 0;
        });
    };
    
    // Helper function to parse various time formats
    const parseTaskTime = (timeString: string): Date | null => {
        if (!timeString) return null;
        
        try {
            // Handle "delta:" format
            if (timeString.startsWith("delta:")) {
                // For delta values, we don't have the actual time so return current time
                // (these are already being processed)
                return new Date();
            }
            
            // Try to parse as date string
            const date = new Date(timeString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                // Try to parse common format MM/DD/YYYY HH:MM
                const parts = timeString.split(/[\/\s:]/);
                if (parts.length >= 5) {
                    // Format: MM/DD/YYYY HH:MM
                    const month = parseInt(parts[0]) - 1; // Month is 0-indexed
                    const day = parseInt(parts[1]);
                    const year = parseInt(parts[2]);
                    const hour = parseInt(parts[3]);
                    const minute = parseInt(parts[4]);
                    
                    return new Date(year, month, day, hour, minute);
                }
                return null;
            }
            
            return date;
        } catch (e) {
            console.error("Error parsing task time:", e);
            return null;
        }
    };

    if (!tasks || tasks.length === 0) {
        return (
            <>
                <TaskEmpty onRefresh={handleRefresh} />
                <Fab 
                    color="primary" 
                    className="add-task-fab"
                    onClick={() => setIsCreatorOpen(true)}
                    aria-label="add task"
                >
                    <Add />
                </Fab>
                <TaskCreator 
                    open={isCreatorOpen} 
                    onClose={() => setIsCreatorOpen(false)} 
                />
            </>
        );
    }

    return (
        <Box className={`task-dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            {/* <Paper elevation={0} className="task-dashboard-header">
                <Typography variant="h4" className="dashboard-title">
                    {isMobile ? "Tasks" : "Task Dashboard"}
                </Typography>
                <Box className="refresh-button" onClick={handleRefresh}>
                    <Refresh />
                </Box>
            </Paper> */}
            
            <TasksSummary 
                totalTasks={tasks.length}
                activeTasks={activeTasks.length}
                inProgressTasks={inProgressTasks.length}
            />
            
            <Paper elevation={0} className="task-content-container">
                <div className="task-scroll-container">
                    <Tabs 
                        value={tabValue} 
                        onChange={(_, newValue) => setTabValue(newValue)}
                        className="task-tabs"
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons={isMobile ? "auto" : undefined}
                        allowScrollButtonsMobile={isMobile}
                    >
                        <Tab 
                            label={
                                <Box className="tab-content">
                                    <span>{isMobile ? "All" : "All Active"}</span>
                                    <span className="tab-count">{activeTasks.length}</span>
                                </Box>
                            } 
                        />
                        <Tab 
                            label={
                                <Box className="tab-content">
                                    <span>{isMobile ? "In Prog." : "In Progress"}</span>
                                    <span className="tab-count">{inProgressTasks.length}</span>
                                </Box>
                            } 
                            disabled={inProgressTasks.length === 0}
                        />
                        <Tab 
                            label={
                                <Box className="tab-content">
                                    <span>Pending</span>
                                    <span className="tab-count">{pendingTasks.length}</span>
                                </Box>
                            } 
                            disabled={pendingTasks.length === 0}
                        />
                    </Tabs>
                    
                    <Divider />
                    
                    {filteredTasks.length === 0 ? (
                        <Box className="no-tasks-message">
                            <Typography variant="h6">No tasks in this category</Typography>
                            <Typography variant="body2">
                                Try selecting a different category or refresh the dashboard
                            </Typography>
                        </Box>
                    ) : (
                        <Box className="task-grid" ref={taskGridRef}>
                            {sortTasksByTime(filteredTasks)
                                .map((task: any, index: number) => (
                                    <TaskCard 
                                        key={task.id || index} 
                                        task={task} 
                                    />
                                ))}
                        </Box>
                    )}
                </div>
            </Paper>
            
            <Fab 
                color="primary" 
                className="add-task-fab"
                onClick={() => setIsCreatorOpen(true)}
                aria-label="add task"
            >
                <Add />
            </Fab>
            
            <TaskCreator 
                open={isCreatorOpen} 
                onClose={() => setIsCreatorOpen(false)} 
            />
        </Box>
    );
};

export default TaskManager;