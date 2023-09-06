import { useEffect, useState } from "react";
import Cache from "../Cache";


const useRecentMedia = () => {
    const [recents, setRecents] = useState<any>(Cache.getJson("recents") || []);

    useEffect(() => {
        Cache.set("recents", JSON.stringify(recents));
    }, [recents]);

    return [recents, setRecents];
};

export default useRecentMedia;