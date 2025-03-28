const IS_LOCALHOST = false;// window.location.hostname === "localhost";
export const API = IS_LOCALHOST ?  "http://localhost:8989" : "http://pihome:8989/";
export const SOCKET_API = IS_LOCALHOST ? "ws://localhost:8765" : "ws://pihome:8765/";


