import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../AxiosClient';

const getStatus= (status: string) => {
    const promise = axiosClient.get(`/status${status === "" ? "" : "/"+status}`, {});
    return promise;
}

export const useCurrentStatus= (status = "") => {
    return useQuery(['getCurrentStatus'], () => getStatus(status), {});
}