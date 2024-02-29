import { useEffect, useState } from "react";
import { useEventIntrospection } from "../hooks/useEventIntrospection";
import "./EventManager.css";
import { MenuItem, Select } from "@mui/material";
import { render } from "@testing-library/react";

const EventManager = () => {
    const introspection = useEventIntrospection();
    const [selectedEvent, setSelectedEvent] = useState<string>("");

    useEffect(() => {
        introspection.mutate();
    }, []);

    const renderEventSelection = () => {
        return (
            <Select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
            >
                {
                    // @ts-ignore
                    introspection.data?.data?.definitions.map((event: any, idx: number) => 
                        <MenuItem value={event.type} key={"event-"+idx}>{event.type}</MenuItem>
                    )
                }
            </Select>
        )
    }

    if (introspection.isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    if (introspection.isError) {
        return (
            <div>
                Error...
            </div>
        )
    }
    if (!introspection.data) {
        return (
            <div>
                No Data...
            </div>
        )
    }

    return (
        <div className={"event-manager-container"}>
            {renderEventSelection()}
        </div>
    )
}

export default EventManager;