import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "../AxiosClient";

type NewTimer = {
    label: string;
    duration: number;
}

export const useNewTimer  = () => {
    return useMutation((data: NewTimer): any => {
        const payload = {
            "webhook": {
                "type": "timer",
                ...data
            }
        }
        return axiosClient.post('', payload);
    });
}
