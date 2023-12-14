import { useEffect, useState } from "react";
import { SOCKET_API } from "../constants";


export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket>();
    const [online, setOnline] = useState<boolean>(false);

    useEffect(() => {
        const socket = new WebSocket(SOCKET_API);
        socket.onclose = () => setOnline(false);
        setSocket(socket);
        socket.onopen = () => setOnline(true);
        return () => {
            socket.close();
        }
    }, []);

    return {socket, online};
}