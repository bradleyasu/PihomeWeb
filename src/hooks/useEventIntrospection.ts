import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "../AxiosClient";

export const useEventIntrospection  = () => {
    return useMutation((): any => {
        const payload = {
            "webhook": {
                "type": "introspect",
            }
        }
        return axiosClient.post('', payload);
    });
}
