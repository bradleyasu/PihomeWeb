import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket"

interface Props {
    children: React.ReactNode;
}

type PiHomeContextType = {
    phstate: any;
    online: boolean;
    send_payload: (payload: any) => void;
}

const PiHomeContext = createContext<PiHomeContextType>({} as PiHomeContextType);

const PihomeStateProvider = ({children}: Props) => {

    const { socket, online } = useSocket();
    const [phstate, setPhstate] = useState<any>({});
    const [thread, setThread] = useState<any>(null);

    useEffect(() => {
        if (!socket || !online) return;
        console.log("Setting up socket...");
        runThread();
    }, [socket, online]);

    const runThread = () => {
        if (thread) return;
        if (thread) clearInterval(thread);
        const t = setInterval(() => _send_status_request(), 1000);
        setThread(t);
    }

    const _send_status_request = () => {
        if (!socket || !online) return;
        socket.send(JSON.stringify({"type": "status"}));
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "status") {
                setPhstate(data);
            }
        }
    }

    const send_payload = (payload: any) => {
        if (!socket || !online) return;
        socket.send(JSON.stringify(payload));
    }

    return (
        <PiHomeContext.Provider value={{phstate, online: online, send_payload}}>
            {children}
        </PiHomeContext.Provider>
    )
}

const usePiHome = () => {
    const context = useContext(PiHomeContext);
    if (context === undefined) {
        throw new Error('usePiHome must be used within a PiHomeStateProvider');
    }
    return context;
}

export { usePiHome, PiHomeContext, PihomeStateProvider };
