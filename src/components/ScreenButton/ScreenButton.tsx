import { Card, Typography } from "@mui/material";
import { Screen } from "../../pages/ScreenControl";
import "./ScreenButton.css";



interface Props {
    screen: Screen;
    id: string;
    onClick?: () => void;
    isActive?: boolean;
}

const ScreenButton = ({screen, id, onClick, isActive = false}: Props) => {

    return (
        <Card 
            onClick={() => {onClick && onClick()}}
            className={"screen_button"} 
            raised={isActive}
            style={{
                opacity: isActive ? 1 : 0.9,
            }}
        >
            <img src={screen.icon} alt={screen.label} width="50%"/>
            <Typography variant="h5">{screen.label}</Typography>
        </Card>
    )
}

export default ScreenButton;