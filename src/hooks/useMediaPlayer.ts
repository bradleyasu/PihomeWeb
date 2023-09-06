import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "../AxiosClient";
import useRecentMedia from "./useRecentMedia";


export const useMediaPlayer = () => {
    const [ recents, setRecents ] = useRecentMedia();

    return useMutation((data: any) => {
        if (data.play && recents.indexOf(data.play) === -1) {
            setRecents([...recents, data.play]);
        }
        return axiosClient.post('', data);
    });
}
