import { Container } from "@mui/material";
import MediaPlayer from "../components/MediaPlayer/MediaPlayer";
import "./Media.css";

const Media = () => {
    return (
        <div
            className={"media_container"}
        >
            <MediaPlayer />
        </div>
    )
}

export default Media;