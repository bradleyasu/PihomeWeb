import { Button, Divider } from "@mui/material";
import { MdOutlineWifiFind } from "react-icons/md";
import { usePiHome } from "./providers/PihomeStateProvider";
import ScreenControl from "./pages/ScreenControl";
import Media from "./pages/Media";
import Timers from "./pages/Timers";
import TaskManager from "./pages/TaskManager";

interface Props {
    view: string;
}

const PiHome = ({view}: Props) => {
    const pihome = usePiHome();


    // views is a key value pair where key is string and value is a react component
    const views: {[key: string]: React.ReactNode} = {
        "media": <Media />,
        "commands": <div>Commands</div>,
        "screens": <ScreenControl />,
        "timers": <Timers />,
        "default": <div>Default</div>,
        "tasks_manager": <TaskManager />,
    };


    const renderConnecting = () => {
      return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 50px)",
                width: "100vw",
                overflow: "hidden",
                flexDirection: "column",
                backgroundColor: "#ffffff",
            }}
        >
            <h1>
                <MdOutlineWifiFind />
            </h1>
          <Divider />
          <h3>Connecting...</h3>
          <Button
            onClick={() => {
                window.location.reload();
            }}
          >
            Reload
          </Button>
        </div>
      )
    }
    
    return (
        <div
            style={{
                backgroundColor: "#000000",
                backgroundImage: "url("+pihome.phstate?.wallpaper?.source+")",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                height: "calc(100vh - 60px)",
                backgroundPosition: "center",
                overflow: "hidden",
            }}
        >
            {!pihome.online ? renderConnecting() : views[view] }
        </div>
    )

}

export default PiHome;