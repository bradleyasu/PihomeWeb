import { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    Switch,
    FormControlLabel,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import { Close, Add, ExpandMore } from "@mui/icons-material";
import { useCreateTask, mapPriorityToNumber, TaskPriority } from "../../hooks/useCreateTask";
import "./TaskCreator.css";
import { usePiHome } from "../../providers/PihomeStateProvider";
import EventSelector from "./EventSelector";

interface TaskCreatorProps {
    open: boolean;
    onClose: () => void;
}

const TaskCreator = ({ open, onClose }: TaskCreatorProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDarkMode = theme.palette.mode === 'dark';
    const pihome = usePiHome();
    const createTaskMutation = useCreateTask();
    
    // Form state
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("medium");
    const [isScheduled, setIsScheduled] = useState(true);
    const [dateTime, setDateTime] = useState("");
    const [repeatDays, setRepeatDays] = useState(0);
    const [isQuickTask, setIsQuickTask] = useState(false);
    
    // Event handlers
    const [onRun, setOnRun] = useState<any>(null);
    const [onConfirm, setOnConfirm] = useState<any>(null);
    const [onCancel, setOnCancel] = useState<any>(null);
    
    // Validation state
    const [nameError, setNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [dateTimeError, setDateTimeError] = useState("");
    
    const resetForm = () => {
        setTaskName("");
        setDescription("");
        setPriority("medium");
        setIsScheduled(true);
        setDateTime("");
        setRepeatDays(0);
        setIsQuickTask(false);
        setOnRun(null);
        setOnConfirm(null);
        setOnCancel(null);
        setNameError("");
        setDescriptionError("");
        setDateTimeError("");
    };
    
    const validateForm = (): boolean => {
        let isValid = true;
        
        if (!taskName.trim()) {
            setNameError("Task name is required");
            isValid = false;
        } else {
            setNameError("");
        }
        
        if (!description.trim()) {
            setDescriptionError("Description is required");
            isValid = false;
        } else {
            setDescriptionError("");
        }
        
        if (isScheduled && !isQuickTask && !dateTime) {
            setDateTimeError("Date and time are required for scheduled tasks");
            isValid = false;
        } else {
            setDateTimeError("");
        }
        
        return isValid;
    };
    
    const handleSubmit = () => {
        if (!validateForm()) return;
        
        const formattedStartTime = isQuickTask 
            ? "delta:5 minutes" 
            : isScheduled 
                ? formatDateTime(dateTime) 
                : undefined;
        
        const taskData = {
            name: taskName,
            description,
            priority: mapPriorityToNumber(priority),
            start_time: formattedStartTime,
            repeat_days: repeatDays > 0 ? repeatDays : undefined,
            on_run: onRun,
            on_confirm: onConfirm,
            on_cancel: onCancel
        };
        
        createTaskMutation.mutate(taskData, {
            onSuccess: () => {
                // Force refresh the task list
                pihome.send_payload({
                    type: "status",
                    force: true
                });
                resetForm();
                onClose();
            },
            onError: (error) => {
                console.error("Failed to create task:", error);
            }
        });
    };
    
    // Convert form dateTime to the expected format
    const formatDateTime = (dateTimeStr: string): string => {
        if (!dateTimeStr) return "";
        
        try {
            const date = new Date(dateTimeStr);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${month}/${day}/${year} ${hours}:${minutes}`;
        } catch (error) {
            console.error("Date formatting error:", error);
            return "";
        }
    };
    
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="sm"
            fullWidth
            className={isDarkMode ? "dark-mode" : ""}
        >
            <DialogTitle className="dialog-title">
                <Typography variant="h6">Create New Task</Typography>
                <IconButton 
                    edge="end" 
                    color="inherit" 
                    onClick={onClose} 
                    aria-label="close"
                    className="close-button"
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            
            <DialogContent className="task-form-content">
                <TextField
                    margin="dense"
                    label="Task Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                    required
                />
                
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={!!descriptionError}
                    helperText={descriptionError}
                    multiline
                    rows={3}
                    required
                />
                
                <FormControl fullWidth margin="dense">
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                        label="Priority"
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                    <FormHelperText>Task priority level</FormHelperText>
                </FormControl>
                
                <Box className="time-selector">
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={isScheduled} 
                                onChange={(e) => setIsScheduled(e.target.checked)}
                            />
                        }
                        label="Scheduled Task"
                    />
                    
                    {isScheduled && (
                        <Box className="schedule-options">
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={isQuickTask} 
                                        onChange={(e) => setIsQuickTask(e.target.checked)}
                                    />
                                }
                                label="Quick Task (5 min)"
                            />
                            
                            {!isQuickTask && (
                                <TextField
                                    margin="dense"
                                    label="Date & Time"
                                    type="datetime-local"
                                    fullWidth
                                    variant="outlined"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                    error={!!dateTimeError}
                                    helperText={dateTimeError}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Repeat Every</InputLabel>
                                <Select
                                    value={repeatDays}
                                    onChange={(e) => setRepeatDays(Number(e.target.value))}
                                    label="Repeat Every"
                                >
                                    <MenuItem value={0}>Don't repeat</MenuItem>
                                    <MenuItem value={1}>Daily</MenuItem>
                                    <MenuItem value={7}>Weekly</MenuItem>
                                    <MenuItem value={14}>Bi-weekly</MenuItem>
                                    <MenuItem value={30}>Monthly</MenuItem>
                                </Select>
                                <FormHelperText>Repeat interval in days</FormHelperText>
                            </FormControl>
                        </Box>
                    )}
                </Box>
                
                <Accordion className="events-accordion">
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Event Handlers</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="caption" className="events-caption">
                            Configure events to trigger when the task runs, is confirmed, or is cancelled.
                        </Typography>
                        
                        <EventSelector 
                            label="On Run Event" 
                            value={onRun} 
                            onChange={setOnRun} 
                            onClear={() => setOnRun(null)}
                        />
                        
                        <EventSelector 
                            label="On Confirm Event" 
                            value={onConfirm} 
                            onChange={setOnConfirm}
                            onClear={() => setOnConfirm(null)} 
                        />
                        
                        <EventSelector 
                            label="On Cancel Event" 
                            value={onCancel} 
                            onChange={setOnCancel}
                            onClear={() => setOnCancel(null)} 
                        />
                    </AccordionDetails>
                </Accordion>
            </DialogContent>
            
            <DialogActions className="task-form-actions">
                <Button 
                    onClick={() => {
                        resetForm();
                        onClose();
                    }}
                    variant="outlined"
                    color="inherit"
                    disabled={createTaskMutation.isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={createTaskMutation.isLoading}
                    className="create-button"
                >
                    {createTaskMutation.isLoading ? (
                        <Box className="loading-button-content">
                            <CircularProgress size={20} color="inherit" />
                            <span>Creating...</span>
                        </Box>
                    ) : (
                        <>
                            <Add className="create-icon" />
                            Create Task
                        </>
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskCreator;
