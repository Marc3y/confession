"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./data/database");
const websocket_1 = require("./websocket/websocket");
const startBackend = () => {
    console.log("Confessions Backend starting...");
    (0, database_1.initDatabase)();
    (0, websocket_1.startWebSocketServer)();
    console.log("Confessions Backend started");
};
startBackend();
