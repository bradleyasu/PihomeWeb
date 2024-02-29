import { Button, Slider, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { BsFillVolumeDownFill, BsFillVolumeUpFill } from "react-icons/bs";
import "./MediaPlayer.css"
import { usePiHome } from "../../providers/PihomeStateProvider";
import { MdPlayArrow, MdSkipNext, MdSkipPrevious, MdStop } from "react-icons/md";

const MediaPlayer = () => {
    const pihome = usePiHome();
    const [url, setUrl] = useState<string>("");
    const [volume, setVolume] = useState<number>(101);

    useEffect(() => {
        // do not send if first load
        if (volume === 101) return;

        pihome.send_payload({
            "type": "audio",
            "action": "volume",
            "value": volume
        });
    }, [volume]);

    useEffect(() => {
        if (!pihome.phstate?.audio?.volume) return;
        setVolume(pihome.phstate?.audio?.volume);
    }, [pihome.phstate]);


    return (
        <div className={"media-player-container"}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img src={pihome.phstate?.audio?.album_art} alt="" width={"128px"} style={{borderRadius: "5px"}}/>
                <h4>{pihome.phstate?.audio?.title || "No Media"}</h4>
            </div>
            <div>
                <TextField 
                    value={url}
                    label="Url"
                    variant="standard"
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <div className="media-controls">
                <Button onClick={() => {
                    pihome.send_payload({
                        "type": "audio",
                        "action": "prev"
                    });
                }}
                >
                    <MdSkipPrevious />
                </Button>
                <Button onClick={() => {
                    // mediaPlayer.mutate({
                    //     "play": url
                    // });
                    localStorage.setItem("last_played", url)
                    pihome.send_payload({
                        "type": "audio",
                        "action": "play_url",
                        "value": url
                    });
                    setUrl("");
                }}>
                    <MdPlayArrow />
                </Button>
                <Button onClick={() => {
                    pihome.send_payload({
                        "type": "audio",
                        "action": "next"
                    });
                }}><MdSkipNext /></Button>
                <Button onClick={() => {
                    // mediaPlayer.mutate({
                    //     "stop": true,
                    //     "clear_queue": true
                    // });
                    pihome.send_payload({
                        "type": "audio",
                        "action": "stop"
                    });
                }}>
                    <MdStop />
                </Button>
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
                        onChangeCommitted={(e, newValue) => setVolume(newValue as number)}
                    />
                    <BsFillVolumeUpFill />
                </Stack>
            </div>
            <div>
                <Button onClick={() => {
                    pihome.send_payload({
                        "type": "audio",
                        "action": "play_url",
                        "value": localStorage.getItem("last_played")
                    })
                }}>{localStorage.getItem("last_played")}</Button>
            </div>
        </div>
    )
}

export default MediaPlayer;