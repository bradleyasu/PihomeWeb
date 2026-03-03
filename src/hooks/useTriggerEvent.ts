import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../AxiosClient";

export const useTriggerEvent = () => {
  return useMutation((payload: any): any => {
    return axiosClient.post("", { webhook: payload });
  });
};
