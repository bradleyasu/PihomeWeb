import { Button, Divider } from "@mui/material";
import MediaPlayer from "./components/MediaPlayer/MediaPlayer";
import { MdOutlineWifiFind } from "react-icons/md";
import { usePiHome } from "./providers/PihomeStateProvider";

interface Props {
    view: string;
}

const PiHome = ({view}: Props) => {
    const pihome = usePiHome();


    // views is a key value pair where key is string and value is a react component
    const views: {[key: string]: React.ReactNode} = {
        "media": <MediaPlayer />,
        "commands": <div>Commands</div>,
        "default": <div>Default</div>,
    };


    const renderConnecting = () => {
      return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
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
                height: "100vh",
                backgroundPosition: "center",
            }}
        >
            {!pihome.online ? renderConnecting() : views[view] }
        </div>
    )

}

export default PiHome;