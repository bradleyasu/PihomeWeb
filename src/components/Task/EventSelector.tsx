import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess, Delete } from "@mui/icons-material";
import "./EventSelector.css";

// Event definitions from the API
const eventDefinitions = [
  { type: "audio", fields: ["action", "value"] },
  { type: "image", fields: ["image", "timeout", "reload_interval"] },
  { type: "sfx", fields: ["name", "state", "loop"] },
  { type: "display", fields: ["title", "message", "image", "background", "timeout"] },
  { type: "alert", fields: ["title", "message", "timeout", "level", "buttons", "on_yes", "on_no"] },
  { type: "app", fields: ["app"] },
  { type: "timer", fields: ["label", "duration", "on_complete"] },
  { type: "wallpaper", fields: ["action", "value"] },
  { type: "status", fields: [] },
  { type: "delete", fields: ["entity", "id"] },
  { type: "command", fields: ["command"] }
];

// Field types based on definitions
const fieldTypes: Record<string, string> = {
  timeout: "number",
  reload_interval: "number",
  duration: "number",
  loop: "boolean"
};

interface EventSelectorProps {
  label: string;
  value: any;
  onChange: (event: any) => void;
  onClear: () => void;
}

const EventSelector = ({ label, value, onChange, onClear }: EventSelectorProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState(false);
  const [eventType, setEventType] = useState<string>("");
  const [eventData, setEventData] = useState<any>({});

  useEffect(() => {
    if (value && value.type) {
      setEventType(value.type);
      setEventData({ ...value });
      setExpanded(true);
    } else {
      setEventType("");
      setEventData({});
    }
  }, [value]);

  const handleEventTypeChange = (newType: string) => {
    setEventType(newType);
    const newData = { type: newType };
    setEventData(newData);
    onChange(newData);
  };

  const handleFieldChange = (field: string, newValue: any) => {
    const updatedData = { 
      ...eventData,
      [field]: fieldTypes[field] === "number" ? Number(newValue) : 
               fieldTypes[field] === "boolean" ? Boolean(newValue) : 
               newValue 
    };
    setEventData(updatedData);
    onChange(updatedData);
  };

  const getFieldComponent = (field: string) => {
    const fieldType = fieldTypes[field] || "text";
    
    if (fieldType === "boolean") {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={!!eventData[field]}
              onChange={(e) => handleFieldChange(field, e.target.checked)}
            />
          }
          label={field}
        />
      );
    }
    
    return (
      <TextField
        key={field}
        margin="dense"
        label={field}
        type={fieldType}
        value={eventData[field] || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        fullWidth
        size="small"
        required={field !== "value" && field !== "background"}
      />
    );
  };

  const renderEventFields = () => {
    if (!eventType) return null;
    
    const event = eventDefinitions.find(e => e.type === eventType);
    if (!event) return null;
    
    return (
      <Box className="event-fields">
        {event.fields.map(field => (
          <Box key={field} className="event-field">
            {getFieldComponent(field)}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box className={`event-selector ${isDarkMode ? 'dark-mode' : ''}`}>
      <Box className="event-selector-header" onClick={() => setExpanded(!expanded)}>
        <Typography variant="subtitle1">{label}</Typography>
        <Box className="event-actions">
          {eventType && (
            <Box className="event-type-chip">
              {eventType}
            </Box>
          )}
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </Box>
      
      <Collapse in={expanded}>
        <Box className="event-config">
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel>Event Type</InputLabel>
            <Select
              value={eventType}
              onChange={(e) => handleEventTypeChange(e.target.value)}
              label="Event Type"
            >
              <MenuItem value="">None</MenuItem>
              {eventDefinitions.map(event => (
                <MenuItem key={event.type} value={event.type}>
                  {event.type}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the type of event to trigger</FormHelperText>
          </FormControl>
          
          {eventType && renderEventFields()}
          
          {eventType && (
            <Box className="event-actions-footer">
              <Button 
                startIcon={<Delete />} 
                color="error" 
                size="small"
                onClick={onClear}
              >
                Clear Event
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default EventSelector;
