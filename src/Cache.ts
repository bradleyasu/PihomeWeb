

const Cache = () => {


    const get = (key: string) => {
        return localStorage.getItem(key) || "";
    }

    const set = (key: string, value: any) => {
        localStorage.setItem(key, value);
    }

    const has = (key: string) => {
        return get(key) !== null;
    }

    const remove = (key: string) => {
        localStorage.removeItem(key);
    }

    const clear = () => {
        localStorage.clear();
    }

    const getJson = (key: string)  => {
        try {
            return JSON.parse(get(key));
        } catch (e) {
            return [];
        }
    }

    return {
        get,
        set,
        has,
        remove,
        clear,
        getJson
    }

}

const cache = Cache();

export default cache;