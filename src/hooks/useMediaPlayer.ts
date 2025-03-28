import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../AxiosClient';

const getStatus= () => {
    const promise = axiosClient.get(`/status/audio`, {});
    return promise;
}

export const useCurrentStatus= () => {
    return useQuery(['getCurrentStatus'], () => getStatus(), {});
}