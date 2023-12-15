import { Container, Grid } from "@mui/material";
import ScreenButton from "../components/ScreenButton/ScreenButton";
import { usePiHome } from "../providers/PihomeStateProvider";
import "./ScreenControl.css";


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

    const handleClick = (id: string) => {
        pihome.send_payload({
            "type": "screen",
            "screen": id,
        });
    }
    
    return (
        <Container maxWidth="md" className={"screen_control_container"} >
            <Grid 
                container 
                padding={"10px"}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                {screens?.screens?.filter((screen: any) => screen[Object.keys(screen)[0]]?.hidden === false && screen[Object.keys(screen)[0]]?.requires_pin === false)
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