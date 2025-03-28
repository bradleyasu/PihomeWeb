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
  Tooltip,
  Paper,
} from "@mui/material";
import { ExpandMore, ExpandLess, Delete, Info, Code } from "@mui/icons-material";
import "./EventSelector.css";

// Complete event definitions based on the API specification
const eventDefinitions = [
  {
    type: "audio",
    fields: [
      { name: "action", type: "string", required: true },
      { name: "value", type: "string", required: false }
    ]
  },
  {
    type: "image",
    fields: [
      { name: "image", type: "string", required: true },
      { name: "timeout", type: "integer", required: true },
      { name: "reload_interval", type: "integer", required: true }
    ]
  },
  {
    type: "task",
    fields: [
      { name: "name", type: "string", required: true },
      { name: "description", type: "string", required: true },
      { name: "start_time", type: "string", required: false },
      { name: "state_id", type: "string", required: false },
      { name: "trigger_state", type: "string", required: false },
      { name: "status", type: "string", required: true },
      { name: "priority", type: "integer", required: true, description: "1 = Low, 2 = Medium, 3 = High" },
      { name: "repeat_days", type: "integer", required: false }
      // Note: on_run, on_confirm, on_cancel are handled separately as nested events
    ]
  },
  {
    type: "display",
    fields: [
      { name: "title", type: "string", required: true },
      { name: "message", type: "string", required: true },
      { name: "image", type: "string", required: true },
      { name: "background", type: "string", required: false },
      { name: "timeout", type: "integer", required: false }
    ]
  },
  {
    type: "alert",
    fields: [
      { name: "title", type: "string", required: true },
      { name: "message", type: "string", required: true },
      { name: "timeout", type: "integer", required: true },
      { name: "level", type: "string", required: true },
      { name: "buttons", type: "string", required: true },
      { name: "on_yes", type: "string", required: false },
      { name: "on_no", type: "string", required: false }
    ]
  },
  {
    type: "sfx",
    fields: [
      { name: "name", type: "string", required: true },
      { name: "state", type: "string", required: true },
      { name: "loop", type: "boolean", required: false }
    ]
  },
  {
    type: "delete",
    fields: [
      { name: "entity", type: "string", required: true },
      { name: "id", type: "string", required: true }
    ]
  },
  {
    type: "acktask",
    fields: [
      { name: "confirm", type: "boolean", required: true }
    ]
  },
  {
    type: "introspect",
    fields: [
      { name: "event", type: "string", required: false }
    ]
  },
  {
    type: "state_changed",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "state", type: "string", required: false, description: "updated state" },
      { name: "data", type: "object", required: false, description: "additional data" }
    ],
    comment: "Internal State Event. Not meant to be used directly, unless you are testing."
  },
  {
    type: "shell",
    fields: [
      { name: "command", type: "string", required: true },
      { name: "args", type: "string", required: false },
      { name: "on_complete", type: "event", required: false },
      { name: "on_error", type: "event", required: false }
    ]
  },
  {
    type: "app",
    fields: [
      { name: "app", type: "string", required: true }
    ]
  },
  {
    type: "timer",
    fields: [
      { name: "label", type: "string", required: true },
      { name: "duration", type: "integer", required: true },
      { name: "on_complete", type: "event", required: false }
    ]
  },
  {
    type: "homeassistant",
    fields: [
      { name: "entity_id", type: "string", required: true },
      { name: "state", type: "string", required: false, description: "State to set the entity to. Example: turn_on, turn_off" },
      { name: "method", type: "string", required: true, description: "Method to use. Options: set, get" },
      { name: "data", type: "json", required: false, description: "JSON data to send to Home Assistant" }
    ],
    comment: "Refer to entities in home assistant by their entity_id. Example: light.living_room_light"
  },
  {
    type: "status",
    fields: []
  },
  {
    type: "multi",
    fields: [
      { name: "events", type: "list", required: true }
    ]
  },
  {
    type: "command",
    fields: [
      { name: "command", type: "string", required: true }
    ]
  },
  {
    type: "wallpaper",
    fields: [
      { name: "action", type: "string", required: true },
      { name: "value", type: "string", required: false }
    ]
  }
];

// Field helper data
const levelOptions = ["info", "warning", "error", "success"];
const methodOptions = ["set", "get"];
const audioActionOptions = ["play", "stop", "pause"];
const wallpaperActionOptions = ["set", "random"];

interface EventSelectorProps {
  label: string;
  value: any;
  onChange: (event: any) => void;
  onClear: () => void;
  nestedLevel?: number;
}

const EventSelector = ({ 
  label, 
  value, 
  onChange, 
  onClear, 
  nestedLevel = 0 
}: EventSelectorProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState(false);
  const [eventType, setEventType] = useState<string>("");
  const [eventData, setEventData] = useState<any>({});
  const [multiEvents, setMultiEvents] = useState<any[]>([]);
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const [jsonValue, setJsonValue] = useState("{}");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    if (value && value.type) {
      setEventType(value.type);
      setEventData({ ...value });
      
      // Handle multi events
      if (value.type === "multi" && Array.isArray(value.events)) {
        setMultiEvents([...value.events]);
      }
      
      // Handle JSON fields
      const event = eventDefinitions.find(e => e.type === value.type);
      if (event) {
        const jsonField = event.fields.find(f => f.type === "json");
        if (jsonField && value[jsonField.name]) {
          setJsonValue(typeof value[jsonField.name] === 'string' 
            ? value[jsonField.name] 
            : JSON.stringify(value[jsonField.name], null, 2));
        }
      }
      
      setExpanded(true);
    } else {
      setEventType("");
      setEventData({});
      setMultiEvents([]);
      setJsonValue("{}");
    }
  }, [value]);

  const handleEventTypeChange = (newType: string) => {
    setEventType(newType);
    const newData = { type: newType };
    
    // Initialize default values for required fields
    const event = eventDefinitions.find(e => e.type === newType);
    if (event) {
      event.fields.forEach(field => {
        if (field.required) {
          // @ts-ignore
          if (field.type === "integer") newData[field.name] = 0;
          // @ts-ignore
          else if (field.type === "boolean") newData[field.name] = false;
          // @ts-ignore
          else if (field.type === "string") newData[field.name] = "";
          // @ts-ignore
          else if (field.type === "list") newData[field.name] = [];
          // @ts-ignore
          else if (field.type === "json") newData[field.name] = {};
        }
      });
    }
    
    setEventData(newData);
    
    // Reset multi events for a new multi type
    if (newType === "multi") {
      setMultiEvents([]);
    }
    
    onChange(newData);
  };

  const handleFieldChange = (field: any, newValue: any) => {
    let processedValue = newValue;
    
    // Convert types as needed
    if (field.type === "integer") {
      processedValue = Number(newValue);
    } else if (field.type === "boolean") {
      processedValue = Boolean(newValue);
    }
    
    const updatedData = { 
      ...eventData,
      [field.name]: processedValue
    };
    
    setEventData(updatedData);
    onChange(updatedData);
  };

  const handleJsonChange = (fieldName: string) => {
    try {
      const parsedJson = JSON.parse(jsonValue);
      setJsonError("");
      
      const updatedData = { 
        ...eventData,
        [fieldName]: parsedJson
      };
      
      setEventData(updatedData);
      onChange(updatedData);
      setJsonEditorOpen(false);
    } catch (e) {
      // @ts-ignore
      setJsonError("Invalid JSON: " + e.message);
    }
  };

  const handleMultiEventAdd = () => {
    const newEvents = [...multiEvents, {}];
    setMultiEvents(newEvents);
    
    const updatedData = {
      ...eventData,
      events: newEvents
    };
    
    setEventData(updatedData);
    onChange(updatedData);
  };

  const handleMultiEventChange = (index: number, newEvent: any) => {
    const updatedEvents = [...multiEvents];
    updatedEvents[index] = newEvent;
    
    setMultiEvents(updatedEvents);
    
    const updatedData = {
      ...eventData,
      events: updatedEvents
    };
    
    setEventData(updatedData);
    onChange(updatedData);
  };

  const handleMultiEventRemove = (index: number) => {
    const updatedEvents = multiEvents.filter((_, i) => i !== index);
    setMultiEvents(updatedEvents);
    
    const updatedData = {
      ...eventData,
      events: updatedEvents
    };
    
    setEventData(updatedData);
    onChange(updatedData);
  };

  const renderFieldInput = (field: any) => {
    // Handle nested event fields
    if (field.type === "event") {
      return (
        <Box key={field.name} sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {field.name}
          </Typography>
          <Box sx={{ pl: 2, borderLeft: `1px solid ${theme.palette.divider}` }}>
            <EventSelector
              label={`${field.name} Event`}
              value={eventData[field.name]}
              onChange={(newEvent) => handleFieldChange(field, newEvent)}
              onClear={() => handleFieldChange(field, null)}
              nestedLevel={nestedLevel + 1}
            />
          </Box>
        </Box>
      );
    }
    
    // Handle list type for multi events
    if (field.type === "list" && field.name === "events") {
      return (
        <Box key={field.name} className="multi-events-container">
          <Typography variant="subtitle2" gutterBottom>
            Events
          </Typography>
          
          {multiEvents.map((event, index) => (
            <Box key={index} className="multi-event-item">
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">
                  Event {index + 1}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleMultiEventRemove(index)}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ pl: 2, borderLeft: `1px solid ${theme.palette.divider}` }}>
                <EventSelector
                  label={`Event ${index + 1}`}
                  value={event}
                  onChange={(newEvent) => handleMultiEventChange(index, newEvent)}
                  onClear={() => handleMultiEventRemove(index)}
                  nestedLevel={nestedLevel + 1}
                />
              </Box>
            </Box>
          ))}
          
          <Button 
            size="small" 
            variant="outlined" 
            onClick={handleMultiEventAdd}
            sx={{ mt: 1 }}
          >
            Add Event
          </Button>
        </Box>
      );
    }
    
    // Handle JSON type
    if (field.type === "json") {
      return (
        <Box key={field.name} className="json-field-container">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <InputLabel>{field.name}</InputLabel>
            <Button 
              size="small" 
              startIcon={<Code />}
              onClick={() => setJsonEditorOpen(!jsonEditorOpen)}
            >
              Edit JSON
            </Button>
          </Box>
          
          {jsonEditorOpen && (
            <Box mt={1} className="json-editor">
              <TextField
                multiline
                rows={4}
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                fullWidth
                error={!!jsonError}
                helperText={jsonError}
                variant="outlined"
                size="small"
              />
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => handleJsonChange(field.name)}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      );
    }
    
    // Handle boolean type
    if (field.type === "boolean") {
      return (
        <FormControlLabel
          key={field.name}
          control={
            <Switch
              checked={!!eventData[field.name]}
              onChange={(e) => handleFieldChange(field, e.target.checked)}
            />
          }
          label={field.name}
        />
      );
    }
    
    // Handle select fields with predefined options
    if (field.name === "level") {
      return (
        <FormControl key={field.name} fullWidth margin="dense" size="small">
          <InputLabel>{field.name}</InputLabel>
          <Select
            value={eventData[field.name] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            label={field.name}
          >
            {levelOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          {field.description && (
            <FormHelperText>{field.description}</FormHelperText>
          )}
        </FormControl>
      );
    }
    
    if (field.name === "method" && eventType === "homeassistant") {
      return (
        <FormControl key={field.name} fullWidth margin="dense" size="small">
          <InputLabel>{field.name}</InputLabel>
          <Select
            value={eventData[field.name] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            label={field.name}
          >
            {methodOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          {field.description && (
            <FormHelperText>{field.description}</FormHelperText>
          )}
        </FormControl>
      );
    }
    
    if (field.name === "action" && eventType === "audio") {
      return (
        <FormControl key={field.name} fullWidth margin="dense" size="small">
          <InputLabel>{field.name}</InputLabel>
          <Select
            value={eventData[field.name] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            label={field.name}
          >
            {audioActionOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    
    if (field.name === "action" && eventType === "wallpaper") {
      return (
        <FormControl key={field.name} fullWidth margin="dense" size="small">
          <InputLabel>{field.name}</InputLabel>
          <Select
            value={eventData[field.name] || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            label={field.name}
          >
            {wallpaperActionOptions.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    
    // Default text/number input
    return (
      <TextField
        key={field.name}
        margin="dense"
        label={field.name}
        type={field.type === "integer" ? "number" : "text"}
        value={eventData[field.name] || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        fullWidth
        size="small"
        required={field.required}
        helperText={field.description}
      />
    );
  };

  const renderEventFields = () => {
    if (!eventType) return null;
    
    const event = eventDefinitions.find(e => e.type === eventType);
    if (!event) return null;
    
    return (
      <Box className="event-fields">
        {event.comment && (
          <Box className="event-comment">
            <Typography variant="caption" color="textSecondary">
              <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              {event.comment}
            </Typography>
          </Box>
        )}
        
        {event.fields.map(field => (
          <Box key={field.name} className="event-field">
            {renderFieldInput(field)}
          </Box>
        ))}
      </Box>
    );
  };

  // If this is a deeply nested event, use a simplified UI
  if (nestedLevel > 1) {
    return (
      <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
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
        </FormControl>
        
        {eventType && renderEventFields()}
        
        {eventType && (
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button 
              size="small"
              color="error" 
              onClick={onClear}
            >
              Clear
            </Button>
          </Box>
        )}
      </Paper>
    );
  }

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

// Helper icon component
// @ts-ignore
const InfoIcon = (props) => <Info {...props} />;

export default EventSelector;
