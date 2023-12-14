import { Divider } from "@mui/material";
import MediaPlayer from "./components/MediaPlayer/MediaPlayer";
import { MdOutlineWifiFind } from "react-icons/md";
import { usePiHome } from "./providers/PihomeStateProvider";


const PiHome = () => {
    const pihome = usePiHome();

    const renderConnecting = () => {
      return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                width: "100vw",
                flexDirection: "column",
            }}
        >
            <h1>
                <MdOutlineWifiFind />
            </h1>
          <Divider />
          <h3>Connecting...</h3>
        </div>
      )
    }
    
    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                backgroundImage: "url("+pihome.phstate?.wallpaper?.source+")",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                height: "100vh",
            }}
        >
            {!pihome.online ? renderConnecting() : <MediaPlayer />}
        </div>
    )

}

export default PiHome;