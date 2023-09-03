import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "../AxiosClient";


export const useMediaPlayer = () => {
    return useMutation((data: any) => axiosClient.post('', data));
}
