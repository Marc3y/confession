"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWebSocketServer = void 0;
const ws_1 = require("ws");
const https_1 = require("https");
const fs_1 = require("fs");
const database_1 = require("../data/database");
const utils_1 = require("../utils/utils");
let webSocketServer;
let votingCode = "GFEUIP45FSESUEGFUE25IWGUEV2FJSDBHBASUZOFD5AWZHFVWBVF6KBSHJ2OFV";
const startWebSocketServer = () => {
    webSocketServer = new WebServer();
};
exports.startWebSocketServer = startWebSocketServer;
class WebServer {
    constructor() {
        this.clients = [];
        this.server = (0, https_1.createServer)({
            cert: (0, fs_1.readFileSync)('/etc/letsencrypt/live/websocket.marceybot.de/cert.pem'),
            key: (0, fs_1.readFileSync)('/etc/letsencrypt/live/websocket.marceybot.de/privkey.pem')
        });
        this.wss = new ws_1.WebSocket.Server({ server: this.server });
        this.wss.on('connection', (ws) => {
            this.onNewConnection(ws);
        });
        this.server.listen(3003, () => console.log("WebSocket Server auf Port 3003 gestartet."));
    }
    getConnection(webSocket) {
        let connection;
        this.clients.forEach(client => {
            if (client.webSocket === webSocket)
                connection = client;
        });
        return connection;
    }
    onNewConnection(webSocket) {
        this.registerClientEvents(webSocket);
    }
    registerClientEvents(ws) {
        ws.on('message', (message) => {
            this.onMessage(ws, message);
        });
        ws.on('close', (code, reason) => {
            let connectionToClose;
            webSocketServer.clients.forEach((client) => {
                if (client.webSocket === ws)
                    connectionToClose = client;
            });
            webSocketServer.clients.filter(item => item !== connectionToClose);
        });
    }
    onMessage(webSocket, message) {
        let jsonData;
        try {
            jsonData = JSON.parse(message);
        }
        catch (err) {
            return;
        }
        console.log(JSON.stringify(jsonData));
        if (jsonData.task === "initSubmit") {
            let connection = new WebSocketConnection(webSocket, From.SUBMIT_SITE);
            this.clients.push(connection);
            connection.sendInitResponse();
            return;
        }
        if (jsonData.task === "initVoting") {
            if (jsonData.code !== votingCode)
                return;
            let connection = new WebSocketConnection(webSocket, From.VOTING_SITE);
            this.clients.push(connection);
            connection.sendInitResponse();
            return;
        }
        if (jsonData.task === "initModding") {
            if (jsonData.code !== votingCode)
                return;
            let connection = new WebSocketConnection(webSocket, From.MODDING_SITE);
            this.clients.push(connection);
            connection.sendInitResponse();
            return;
        }
        if (jsonData.task === "sendConfession") {
            console.log("sendConfession mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.submitConfession(jsonData.confession, jsonData.viewer, jsonData.anonym, jsonData.userName, jsonData.pfp);
            return;
        }
        if (jsonData.task === "getConfessions") {
            console.log("getConfessions mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.getConfessions();
            return;
        }
        if (jsonData.task === "setValid") {
            console.log("setValid mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if (!confessionId)
                return;
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.setValid(confessionId);
            return;
        }
        if (jsonData.task === "setInvalid") {
            console.log("setInvalid mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if (!confessionId)
                return;
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.setInvalid(confessionId);
            return;
        }
        if (jsonData.task === "setDelete") {
            console.log("setDelete mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if (!confessionId)
                return;
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.setDelete(confessionId);
            return;
        }
        if (jsonData.task === "setVoted") {
            console.log("setVoted mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if (!confessionId)
                return;
            let streamerVoted = jsonData.streamerVoted;
            if (!streamerVoted)
                return;
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.setConfessionVoted(confessionId, streamerVoted);
            return;
        }
        if (jsonData.task === "getRatio") {
            console.log("getRatio mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.getRatio();
            return;
        }
        if (jsonData.task === "getRandomConfession") {
            console.log("getRandomConfession mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.getRandomConfession();
            return;
        }
        if (jsonData.task === "setVotedAndGetRandomConfession") {
            console.log("getRandomConfession mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            connection.getRandomConfession();
            return;
        }
        if (jsonData.task === "getTTS") {
            console.log("getTTS mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if (!connection)
                return;
            let confessionId = jsonData.confessionId;
            if (!confessionId)
                return;
            let text = jsonData.text;
            if (!text)
                return;
            connection.getTTS(confessionId, text);
        }
    }
}
class WebSocketConnection {
    constructor(webSocket, from) {
        this.from = from;
        this.webSocket = webSocket;
    }
    sendInitResponse() {
        this.webSocket.send(JSON.stringify({ task: "initResponse", success: true }));
    }
    submitConfession(text, viewer, anonym, userName, pfp) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentTime = (0, utils_1.getCurrentTimeStr)();
            let confessionId = (0, utils_1.generateUUID)(25);
            yield database_1.database.insert("confessions", { id: confessionId, confession: text, viewer: viewer, date: currentTime, anonym: anonym, userName: userName, pfp: pfp, voted: false, votedChannel: undefined, valid: "not_reviewed" });
            this.webSocket.send(JSON.stringify({ task: "sendConfessionResponse", success: true }));
        });
    }
    getConfessions() {
        return __awaiter(this, void 0, void 0, function* () {
            let documents = yield database_1.database.getAllDocuments("confessions");
            this.webSocket.send(JSON.stringify({ task: "getConfessionsResponse", success: true, confessions: documents }));
        });
    }
    setConfessionVoted(confessionId, streamerVoted) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.database.update("confessions", { id: confessionId }, { votedChannel: streamerVoted, voted: true });
        });
    }
    getRandomConfession() {
        return __awaiter(this, void 0, void 0, function* () {
            let documents = yield database_1.database.getAllDocuments("confessions");
            let validDocuments = [];
            documents.forEach(document => {
                if (document.valid === "yes" && document.voted === false)
                    validDocuments.push(document);
            });
            console.log("Beichten übrig: " + validDocuments.length);
            let randomConfession = (0, utils_1.getRandomElement)(validDocuments);
            if (randomConfession) {
                this.webSocket.send(JSON.stringify({ task: "getRandomConfessionResponse", success: true, confession: randomConfession }));
            }
            else
                this.webSocket.send(JSON.stringify({ task: "getRandomConfessionResponse", success: false, error: "No confessions left" }));
        });
    }
    getTTS(confessionId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            let ttsData = yield this.createTTS(text);
            this.webSocket.send(JSON.stringify({ task: "getTTSResponse", confessionId: confessionId, ttsData: ttsData }));
        });
    }
    getRatio() {
        return __awaiter(this, void 0, void 0, function* () {
            let documents = yield database_1.database.getAllDocuments("confessions");
            let validDocuments = [];
            let votedRight = 0;
            let totalAmount = 0;
            documents.forEach(document => {
                if (document.voted) {
                    if (document.votedChannel === document.viewer) {
                        votedRight++;
                    }
                    totalAmount++;
                }
            });
            this.webSocket.send(JSON.stringify({ task: "getRatioResponse", success: true, correct: votedRight, total: totalAmount }));
        });
    }
    createTTS(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const options = {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "content-type": "application/json",
                        authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTgyNmUwYjUtOTBiZC00MjliLWEyYzAtNTdkYmM4NTViNmEzIiwidHlwZSI6ImFwaV90b2tlbiJ9.PzCuYTX0xKeUw4DAWDwVNYjGTnEm2DUhjVLREQ3lFGw",
                    },
                    body: JSON.stringify({
                        response_as_dict: true,
                        attributes_as_list: false,
                        show_original_response: false,
                        settings: { amazon: "de-DE_Hans_Standard" },
                        rate: 0,
                        pitch: 0,
                        volume: 0,
                        sampling_rate: 0,
                        providers: "amazon",
                        text: message,
                        language: "de",
                    })
                };
                let response = yield fetch('https://api.edenai.run/v2/audio/text_to_speech', options);
                let data = yield response.json();
                resolve({ ttsData: data });
            }));
        });
    }
    setVotedAndGetRandomConfession(confessionId, streamerVoted) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setConfessionVoted(confessionId, streamerVoted);
            let documents = yield database_1.database.getAllDocuments("confessions");
            let validDocuments = [];
            documents.forEach(document => {
                if (document.valid === "yes" && document.voted === false)
                    validDocuments.push(document);
            });
            console.log("Beichten übrig: " + validDocuments.length);
            let randomConfession = (0, utils_1.getRandomElement)(validDocuments);
            if (randomConfession) {
                this.webSocket.send(JSON.stringify({ task: "setVotedAndGetRandomConfessionResponse", success: true, confession: randomConfession }));
            }
            else
                this.webSocket.send(JSON.stringify({ task: "setVotedAndGetRandomConfessionResponse", success: false, error: "No confessions left" }));
        });
    }
    setValid(confessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.database.update("confessions", { id: confessionId }, { valid: "yes" });
        });
    }
    setInvalid(confessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.database.update("confessions", { id: confessionId }, { valid: "no" });
        });
    }
    setDelete(confessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.database.delete("confessions", { id: confessionId });
        });
    }
}
var From;
(function (From) {
    From[From["SUBMIT_SITE"] = 0] = "SUBMIT_SITE";
    From[From["VOTING_SITE"] = 1] = "VOTING_SITE";
    From[From["MODDING_SITE"] = 2] = "MODDING_SITE";
})(From || (From = {}));
