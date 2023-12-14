import { useEffect, useState } from "react";
import { SOCKET_API } from "../constants";


export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket>();
    const [online, setOnline] = useState<boolean>(false);
    const [reconnectThread, setReconnectThread] = useState<any>(null);

    useEffect(() => {
        if (!socket) return;
        socket.onclose = () => {
            setOnline(false);
            if (reconnectThread) return;
            const thread = setInterval(() => {
                reconnect();
            }, 5000);
            setReconnectThread(thread);
        }
        socket.onopen = () => setOnline(true);
        return () => {
            socket.close();
        }
    }, [socket]);

    useEffect(() => {
        if (!online) return;
        if (reconnectThread) {
            clearInterval(reconnectThread);
            setReconnectThread(null);
        }
    }, [online]);

    useEffect(() => {
        const socket = new WebSocket(SOCKET_API);
        setSocket(socket);
    }, []);

    const reconnect = () =>{
        if (online) {
            clearInterval(reconnectThread);
        }
        const socket = new WebSocket(SOCKET_API);
        setSocket(socket);
    }

    return {socket, online};
}