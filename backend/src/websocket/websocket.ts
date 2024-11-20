import {WebSocket} from "ws";
import {createServer} from "https";
import {readFileSync} from "fs";
import {database} from "../data/database";
import {generateUUID, getCurrentTimeStr, getRandomElement} from "../utils/utils";

let webSocketServer:WebServer | undefined;
let votingCode = "GFEUIP45FSESUEGFUE25IWGUEV2FJSDBHBASUZOFD5AWZHFVWBVF6KBSHJ2OFV";

export const startWebSocketServer = () => {
    webSocketServer = new WebServer();
}

class WebServer {
    server:any;
    wss:any;
    clients:WebSocketConnection[] = [];
    constructor() {
        this.server = createServer({
            cert: readFileSync('/etc/letsencrypt/live/websocket.marceybot.de/cert.pem'),
            key: readFileSync('/etc/letsencrypt/live/websocket.marceybot.de/privkey.pem')
        });
        this.wss = new WebSocket.Server({server: this.server});
        this.wss.on('connection', (ws:any) => {
            this.onNewConnection(ws);
        });
        this.server.listen(3003, () => console.log("WebSocket Server auf Port 3003 gestartet."));
    }
    
    getConnection(webSocket:WebSocket){
        let connection:WebSocketConnection | undefined;
        this.clients.forEach(client => {
           if(client.webSocket === webSocket) connection = client;
        });
        return connection;
    }
    
    private onNewConnection(webSocket:WebSocket){
        this.registerClientEvents(webSocket);
    }

    private registerClientEvents(ws:WebSocket){
        ws.on('message', (message:any) => {
            this.onMessage(ws, message);
        });
        ws.on('close', (code:any, reason:any) => {
            let connectionToClose:WebSocketConnection;
            webSocketServer!.clients.forEach((client:any) => {
                if(client.webSocket === ws) connectionToClose = client;
            });
            webSocketServer!.clients.filter(item => item !== connectionToClose);
        });
    }
    
    private onMessage(webSocket:WebSocket, message:any){
        let jsonData:any;
        try {
            jsonData = JSON.parse(message);
        } catch (err) { return; }

        console.log(JSON.stringify(jsonData));
        
        if(jsonData.task === "initSubmit"){
            let connection = new WebSocketConnection(webSocket, From.SUBMIT_SITE);
            this.clients.push(connection);
            connection.sendInitResponse();
            return;
        }

        if(jsonData.task === "initVoting"){
            if(jsonData.code !== votingCode) return;
            let connection = new WebSocketConnection(webSocket, From.VOTING_SITE);
            this.clients.push(connection);
            connection.sendInitResponse();
            return;
        }
        
        if(jsonData.task === "initModding"){
            if(jsonData.code !== votingCode) return;
            let connection = new WebSocketConnection(webSocket, From.MODDING_SITE);
            this.clients.push(connection);
            connection.sendInitResponse();
            return;
        }
        
        if(jsonData.task === "sendConfession"){
            console.log("sendConfession mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.submitConfession(jsonData.confession, jsonData.viewer, jsonData.anonym, jsonData.userName, jsonData.pfp);
            return;
        }
        if(jsonData.task === "getConfessions"){
            console.log("getConfessions mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.getConfessions();
            return;
        }
        if(jsonData.task === "setValid"){
            console.log("setValid mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if(!confessionId) return;
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.setValid(confessionId);
            return;
        }
        if(jsonData.task === "setInvalid"){
            console.log("setInvalid mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if(!confessionId) return;
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.setInvalid(confessionId);
            return;
        }
        if(jsonData.task === "setDelete"){
            console.log("setDelete mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if(!confessionId) return;
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.setDelete(confessionId);
            return;
        }

        if(jsonData.task === "setVoted"){
            console.log("setVoted mit data " + JSON.stringify(jsonData));
            let confessionId = jsonData.confessionId;
            if(!confessionId) return;
            let streamerVoted = jsonData.streamerVoted;
            if(!streamerVoted) return;
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.setConfessionVoted(confessionId, streamerVoted);
            return;
        }

        if(jsonData.task === "getRatio"){
            console.log("getRatio mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.getRatio();
            return;
        }

        if(jsonData.task === "getRandomConfession"){
            console.log("getRandomConfession mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.getRandomConfession();
            return;
        }

        if(jsonData.task === "setVotedAndGetRandomConfession"){
            console.log("getRandomConfession mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            connection.getRandomConfession();
            return;
        }
        
        if(jsonData.task === "getTTS"){
            console.log("getTTS mit data " + JSON.stringify(jsonData));
            let connection = this.getConnection(webSocket);
            if(!connection) return;
            let confessionId:any = jsonData.confessionId;
            if(!confessionId) return;
            let text:any = jsonData.text;
            if(!text) return;
            connection.getTTS(confessionId, text);
        }
    }
}

class WebSocketConnection {
    webSocket:WebSocket;
    from:From;
    
    constructor(webSocket:WebSocket, from:From) {
        this.from = from;
        this.webSocket = webSocket;
    }
    
    sendInitResponse(){
        this.webSocket.send(JSON.stringify({task: "initResponse", success: true}));
    }

    async submitConfession(text:string, viewer:string, anonym:boolean, userName?:string, pfp?:string){
        let currentTime = getCurrentTimeStr();
        let confessionId = generateUUID(25);
        await database.insert("confessions", {id: confessionId, confession: text, viewer: viewer, date: currentTime, anonym: anonym, userName: userName, pfp: pfp, voted: false, votedChannel: undefined, valid: "not_reviewed"});
        this.webSocket.send(JSON.stringify({task: "sendConfessionResponse", success: true}));
    }

    async getConfessions(){
        let documents = await database.getAllDocuments("confessions");
        this.webSocket.send(JSON.stringify({task: "getConfessionsResponse", success: true, confessions: documents}));
    }
    
    

    async setConfessionVoted(confessionId:string, streamerVoted:string){
        await database.update("confessions", {id: confessionId}, {votedChannel: streamerVoted, voted: true});
    }

    async getRandomConfession(){
        let documents = await database.getAllDocuments("confessions");
        let validDocuments:any[] = [];
        documents.forEach(document => {
            if(document.valid === "yes" && document.voted === false) validDocuments.push(document);
        });
        console.log("Beichten übrig: " + validDocuments.length);
        let randomConfession = getRandomElement(validDocuments);
        if(randomConfession){
            this.webSocket.send(JSON.stringify({task: "getRandomConfessionResponse", success: true, confession: randomConfession}));
        } else this.webSocket.send(JSON.stringify({task: "getRandomConfessionResponse", success: false, error: "No confessions left"}));
    }
    
    async getTTS(confessionId:string, text:string){
        let ttsData:any = await this.createTTS(text);
        this.webSocket.send(JSON.stringify({task: "getTTSResponse", confessionId: confessionId, ttsData: ttsData}));
    }

    async getRatio(){
        let documents = await database.getAllDocuments("confessions");
        let validDocuments:any[] = [];
        let votedRight:number = 0;
        let totalAmount:number = 0;
        documents.forEach(document => {
            if(document.voted){
                if(document.votedChannel === document.viewer) {
                    votedRight++;
                }
                totalAmount++;
            }
        });
        this.webSocket.send(JSON.stringify({task: "getRatioResponse", success: true, correct: votedRight, total: totalAmount}));
    }

    async createTTS(message:string){
        return new Promise<any>(async (resolve:any) => {
            const options = {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTgyNmUwYjUtOTBiZC00MjliLWEyYzAtNTdkYmM4NTViNmEzIiwidHlwZSI6ImFwaV90b2tlbiJ9.PzCuYTX0xKeUw4DAWDwVNYjGTnEm2DUhjVLREQ3lFGw",
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

            let response = await fetch('https://api.edenai.run/v2/audio/text_to_speech', options);
            let data = await response.json();
            resolve({ttsData: data});
        });
    }
    
    async setVotedAndGetRandomConfession(confessionId:string, streamerVoted:string){
        await this.setConfessionVoted(confessionId, streamerVoted);
        let documents = await database.getAllDocuments("confessions");
        let validDocuments:any[] = [];
        documents.forEach(document => {
            if(document.valid === "yes" && document.voted === false) validDocuments.push(document);
        });
        console.log("Beichten übrig: " + validDocuments.length);
        let randomConfession = getRandomElement(validDocuments);
        if(randomConfession){
            this.webSocket.send(JSON.stringify({task: "setVotedAndGetRandomConfessionResponse", success: true, confession: randomConfession}));
        } else this.webSocket.send(JSON.stringify({task: "setVotedAndGetRandomConfessionResponse", success: false, error: "No confessions left"}));
    }

    async setValid(confessionId:string){
        await database.update("confessions", {id: confessionId}, {valid: "yes"});
    }

    async setInvalid(confessionId:string){
        await database.update("confessions", {id: confessionId}, {valid: "no"});
    }
    async setDelete(confessionId:string){
        await database.delete("confessions", {id: confessionId});
    }
}

enum From {
    SUBMIT_SITE,
    VOTING_SITE,
    MODDING_SITE
}