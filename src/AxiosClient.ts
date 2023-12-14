import axios from "axios";
import { API } from "./constants";

export const axiosClient = axios.create({
    baseURL: API,
    withCredentials: false,
    // allow cors
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    },
});