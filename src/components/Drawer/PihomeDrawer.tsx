import { Divider, Drawer, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { usePiHome } from "../../providers/PihomeStateProvider";
import { VERSION } from "../../Version";

interface Props {
    commands: DrawerCommand[];
    onClose: () => void;
}

type DrawerCommand = {
    name: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    payload?: any;
}

const PihomeDrawer = ({commands, onClose}: Props) => {
    const pihome = usePiHome();

    const sendPayload = (payload: any) => {
        pihome.send_payload(payload);
    }

    return (
        <div style={{
            width: "250px",
        }}>
            <div style={{
                height: "100px",
                backgroundColor: "#000000",
                color: "#ffffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
            }}>
                PiHome
            </div>
            {
                commands.map((command: DrawerCommand) => {
                    return (
                        <ListItemButton 
                            key={command.name} 
                            onClick={() => {
                                if(command.payload) {
                                    sendPayload(command.payload);
                                }
                                command.onClick && command.onClick();
                            }
                        }>
                            {command.icon}
                            <ListItemText primary={command.name} />
                        </ListItemButton>
                    )
                })
            }
            <ListItemButton onClick={() => onClose()}>
                <ListItemText primary={"Close"} />
            </ListItemButton>
            <ListItem>
                <ListItemText secondary={"PWA Version: " + VERSION} style={{textAlign: 'center'}}/>
            </ListItem>
        </div>
    )
}

export default PihomeDrawer