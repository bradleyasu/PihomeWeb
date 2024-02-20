import { render } from "@testing-library/react";
import Timer from "../components/Timer/Timer";
import { usePiHome } from "../providers/PihomeStateProvider";
import "./Timers.css";
import { Button, Container, Input } from "@mui/material";
import { useState } from "react";
import { useNewTimer } from "../hooks/useNewTimer";

const Timers = () => {
    const pihome = usePiHome();
    const timers = pihome?.phstate?.timers;
    const newTimerMutation = useNewTimer();
    const [label, setLabel] = useState<string>("");
    const [duration, setDuration] = useState<number | undefined>();


    const renderNoTimers = () => {
        return (
            <Container
                className={"no_timers"}
            >
                <h3>No Timers</h3>
            </Container>
        )
    }

    const newTimerForm = () => {
        return (
            <Container className="new_timer">
                <Input 
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Label"
                />
                <Input 
                    value={duration}
                    placeholder="Duration"
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        // newTimerMutation.mutate({
                        //     label,
                        //     duration: ((duration || 1) * 60),
                        // });
                        pihome.send_payload({
                            "type": "timer",
                            "label": label,
                            "duration": ((duration || 1) * 60),
                        });
                        setLabel("");
                        setDuration(0);
                    }}
                >Create New Timer</Button>

            </Container>
        )

    }

    return (
        <div
            className={"timers_container"}
        >
            {newTimerForm()}
            {
                 timers?.map((timer: any) => <Timer 
                       label={timer.label}
                       endTime={timer.end_time}
                       duration={timer.duration}
                       elapsed={timer.elapsed_time}
                />)
            }
            {
                timers?.length === 0 && renderNoTimers()
            }
        </div>
    )
}

export default Timers;