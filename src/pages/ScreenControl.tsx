import { Button, Container, Grid, Switch } from "@mui/material";
import ScreenButton from "../components/ScreenButton/ScreenButton";
import { usePiHome } from "../providers/PihomeStateProvider";
import "./ScreenControl.css";
import { useState } from "react";
import { VERSION } from "../Version";
import Timer from "../components/Timer/Timer";


export type Screen = {
    icon: string;
    label: string;
    pin: boolean;
    hidden: boolean;
}

const ScreenControl = () => {
    const pihome = usePiHome();
    const screens = pihome?.phstate?.screens;
    const currentScreen = screens?.current;
    const timers = pihome?.phstate?.timers;
    const [hideScreens, setHideScreens] = useState(false);

    const handleClick = (id: string) => {
        pihome.send_payload({
            "type": "screen",
            "screen": id,
        });
    }
    
    return (
        <Container maxWidth="md" className={"screen_control_container"} >
            <Container
                className={"screen_control_header"}
                style={hideScreens ? {
                    opacity: 0.6,
                }: {}}
            >
                <div>
                    {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </div>
                <div>
                    PiHome V{VERSION}
                </div>
                <div>
                    <Switch
                        checked={hideScreens}
                        onChange={() => setHideScreens(!hideScreens)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <span>Hide Screens</span>
                </div>
            </Container>
            <div
                className={"timer_container"}
            >
            {
                timers?.map((timer: any) => <Timer 
                        label={timer.label}
                        endTime={timer.end_time}
                        duration={timer.duration}
                        elapsed={timer.elapsed_time}
                    />
                 )
            }
            </div>
            <Grid 
                container 
                padding={"10px"}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                {screens?.screens?.filter((screen: any) => hideScreens === false && screen[Object.keys(screen)[0]]?.hidden === false && screen[Object.keys(screen)[0]]?.requires_pin === false)
                .map((screen: any) => {
                    const id = Object.keys(screen)[0] as string;
                    const _screen = screen[id];
                    return <ScreenButton isActive={id === currentScreen} screen={_screen} id={id} onClick={() => handleClick(id)}/>
                })}
            </Grid>
        </Container>
    )
}

export default ScreenControl;