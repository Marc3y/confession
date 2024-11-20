import {initDatabase} from "./data/database";
import {startWebSocketServer} from "./websocket/websocket";

const startBackend = () => {
    console.log("Confessions Backend starting...");
    initDatabase();
    startWebSocketServer();
    console.log("Confessions Backend started");
}

startBackend();