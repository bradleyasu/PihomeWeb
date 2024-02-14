import { Typography } from "@mui/material";
import "./Timer.css";



interface Props {
    label: string;
    endTime: number;
    duration: number;
    elapsed: number;
}

const Timer = ({label, endTime, duration, elapsed}: Props) => {
    console.log(label, endTime, duration, elapsed);
    const timeLeft = (duration - elapsed) * 1000;
    // format timeLeft from long into 00:00:00
    const humanReadableTime = new Date(timeLeft).toISOString().substr(11, 8);
    return (
        <div
            className={`timer`}

        >
            <div>{label}</div>
            <div>{humanReadableTime}</div>
        </div>
    )
}

export default Timer;