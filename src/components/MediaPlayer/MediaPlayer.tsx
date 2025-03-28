import { Button, FormControl, InputLabel, Menu, MenuItem, Select, Slider, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { BsFillVolumeDownFill, BsFillVolumeUpFill } from "react-icons/bs";
import "./MediaPlayer.css"
import { usePiHome } from "../../providers/PihomeStateProvider";
import { MdPlayArrow, MdSkipNext, MdSkipPrevious, MdStop } from "react-icons/md";
import { useCurrentStatus } from "../../hooks/useStatus";

const MediaPlayer = () => {
    const pihome = usePiHome();
    const [url, setUrl] = useState<string>("");
    const [volume, setVolume] = useState<number>(101);
    const [sliderVolume, setSliderVolume] = useState<number>(101);
    const [lastUpdate, setLastUpdate] = useState<number>(0);
    const audioStatus = useCurrentStatus("audio");

    const states = [
        "Stopped",
        "Playing",
        "Paused",
        "Fetching",
        "Buffering"
    ]
    useEffect(() => {
        // do not send if first load
        if (volume === 101) return;

        setLastUpdate(Date.now());
        pihome.send_payload({
            "type": "audio",
            "action": "volume",
            "value": volume
        });
    }, [volume]);

    useEffect(() => {
        if (!pihome.phstate?.audio?.volume) return;
        if(sliderVolume === 101) {
            setSliderVolume(pihome.phstate?.audio?.volume);
        }
        // only set the volume if the last update was more than 3 seconds ago
        if (Date.now() - lastUpdate < 3000) return;
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
                <span>{states[pihome.phstate?.audio?.state]}</span>
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
                        value={sliderVolume} 
                        onChange={(e, newValue) => setSliderVolume(newValue as number)}
                        onChangeCommitted={(e, newValue) => setVolume(newValue as number)}
                    />
                    <BsFillVolumeUpFill />
                </Stack>
            </div>
            <div
                style={{
                    width: "100%",
                    paddingLeft: "20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <FormControl fullWidth>
                    <InputLabel>Saved Radio Stations:</InputLabel>
                    <Select
                        label="Radio Stations"
                        variant="standard"
                        defaultValue=""
                        style={{
                            width: "80%"
                        }}
                    >
                        {
                            audioStatus?.data?.data.radio.map((station: any) => {
                                return <MenuItem key={station.id} onClick={() => {
                                    pihome.send_payload({
                                        "type": "audio",
                                        "action": "play_url",
                                        "value": station.url
                                    })
                                }}>{station.text}</MenuItem>})
                            }
                    </Select>
                </FormControl>
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