import { usePiHome } from "../providers/PihomeStateProvider";
import "./TaskManager.css";
import TaskCard from "./../components/Task/TaskCard";
import { Box, Divider, Paper, Tab, Tabs, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import TasksSummary from "./../components/Task/TasksSummary";
import { Refresh } from "@mui/icons-material";
import TaskEmpty from "./../components/Task/TaskEmpty";

const TaskManager = () => {
    const pihome = usePiHome();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';
    const taskGridRef = useRef<HTMLDivElement>(null);
    
    const tasks = pihome?.phstate?.tasks || [];
    const [tabValue, setTabValue] = useState(0);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    
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
        
        // Scroll to top when changing tabs
        if (taskGridRef.current) {
            taskGridRef.current.scrollTop = 0;
        }
    }, [tabValue, tasks]);

    const handleRefresh = () => {
        pihome.send_payload({
            type: "status",
            force: true
        });
    };
    
    if (!tasks || tasks.length === 0) {
        return <TaskEmpty onRefresh={handleRefresh} />;
    }

    return (
        <Box className={`task-dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Paper elevation={0} className="task-dashboard-header">
                <Typography variant="h4" className="dashboard-title">
                    {isMobile ? "Tasks" : "Task Dashboard"}
                </Typography>
                <Box className="refresh-button" onClick={handleRefresh}>
                    <Refresh />
                </Box>
            </Paper>
            
            <TasksSummary 
                totalTasks={tasks.length}
                activeTasks={activeTasks.length}
                inProgressTasks={inProgressTasks.length}
            />
            
            <Paper elevation={0} className="task-content-container">
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
                        {filteredTasks
                            .sort((a: any, b: any) => {
                                // Sort by priority (high -> medium -> low)
                                const priorityOrder = { high: 0, medium: 1, low: 2 };
                                // Sort tasks by priority
                                // const priorityA = priorityOrder[a.priority.toLowerCase()] || 99;
                                // const priorityB = priorityOrder[b.priority.toLowerCase()] || 99;
                                // return priorityA - priorityB;
                                return 0;
                            })
                            .map((task: any, index: number) => (
                                <TaskCard 
                                    key={task.id || index} 
                                    task={task} 
                                />
                            ))}
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default TaskManager;