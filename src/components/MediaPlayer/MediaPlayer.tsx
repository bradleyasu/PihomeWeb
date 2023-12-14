import { Button, Slider, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useMediaPlayer } from "../../hooks/useMediaPlayer";
import { BsFillVolumeDownFill, BsFillVolumeUpFill } from "react-icons/bs";
import "./MediaPlayer.css"
import { VERSION } from "../../Version";
import useRecentMedia from "../../hooks/useRecentMedia";
import { usePiHome } from "../../providers/PihomeStateProvider";

const MediaPlayer = () => {
    const pihome = usePiHome();
    const [url, setUrl] = useState<string>("");
    const [volume, setVolume] = useState<number>(100);
    const [ recents ] = useRecentMedia();
    const mediaPlayer = useMediaPlayer();


    useEffect(() => {
        // mediaPlayer.mutate({
        //     "volume": volume
        // });
        pihome.send_payload({
            "type": "audio",
            "volume": volume
        });
    }, [volume]);

    useEffect(() => {
        if (!pihome.phstate?.audio?.volume) return;
        setVolume(pihome.phstate?.audio?.volume);
    }, [pihome.phstate]);


    return (
        <div className={"media-player-container"}>
            <div>
                <TextField 
                    value={url}
                    label="Url"
                    variant="standard"
                    onChange={(e) => setUrl(e.target.value)}
                    
                />
            </div>
            <div>
                <Button onClick={() => {
                    // mediaPlayer.mutate({
                    //     "play": url
                    // });
                    pihome.send_payload({
                        "type": "audio",
                        "play_url": url
                    });
                    setUrl("");
                }}>Play</Button>
                <Button onClick={() => {
                    // mediaPlayer.mutate({
                    //     "stop": true,
                    //     "clear_queue": true
                    // });
                    pihome.send_payload({
                        "type": "audio",
                        "stop": true
                    });
                }}>Stop</Button>
            </div>
            <div style={{width: "60%"}}>
                <Stack 
                    spacing={2} 
                    direction="row" 
                    sx={{ mb: 1 }} 
                    alignItems="center"
                >
                    <BsFillVolumeDownFill />
                    <Slider 
                        aria-label="Volume" 
                        value={volume} 
                        onChange={(e, newValue) => setVolume(newValue as number)} 
                    />
                    <BsFillVolumeUpFill />
                </Stack>
            </div>
            <div>
                {
                    recents.map((recent: string) => {
                        return (
                            <div key={recent}>
                                <Button onClick={() => {
                                    // mediaPlayer.mutate({
                                    //     "play": recent
                                    // });
                                    pihome.send_payload({
                                        "type": "audio",
                                        "play_url": recent
                                    });
                                }}>{recent}</Button>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                {
                    /// this will need to be moved
                }
                Version: {VERSION}
            </div>
        </div>
    )
}

export default MediaPlayer;