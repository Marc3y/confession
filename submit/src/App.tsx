import './App.css'
import {Pictures} from "./components/Pictures.tsx";
import {SubmitField} from "./components/SubmitField.tsx";
import {Loading} from "./components/Loading.tsx";
import {useEffect, useRef} from "react";
import {Finished} from "./components/Finished.tsx";
import {NoConnection} from "./components/NoConnection.tsx";

export let webSocket:any;
export let webSocketServerLoaded:boolean = false;
export let confessionResponseGetted:boolean = false;

function App() {

    let contentRef:any = useRef(null);
    let loadingRef:any = useRef(null);
    let finishedRef:any = useRef(null);
    let noConnectionRef:any = useRef(null);
    
    let withTwitchLogin:boolean = false;
    
    
    const onLoaded = () => {
        webSocketServerLoaded = true;
        setTimeout(() => {
            loadingRef.current.style.display = "none";
            contentRef.current.style.display = "flex";
            noConnectionRef.current.style.display = "none";
        }, withTwitchLogin ? 0 : 2500);
    }
    
    const startServer = async () => {
        webSocket = new WebSocket('wss://websocket.marceybot.de:3003');
        webSocket.addEventListener('open', () => {
           webSocket.send(JSON.stringify({task: "initSubmit"})) 
        });
        webSocket.addEventListener('message', (event:any) => {
            let data:any = null;
            try {
                data = JSON.parse(event.data);
            } catch (err){ return; }
            if(!data) return;
            if(data.task === "initResponse"){
                onLoaded();
                return;
            }
            if(data.task === "sendConfessionResponse"){
                confessionResponseGetted = true;
                loadingRef.current.style.display = "none";
                contentRef.current.style.display = "none";
                finishedRef.current.style.display = "flex";
                return;
            }
        });
        // @ts-ignore
        webSocket.addEventListener('close', (event:any) => {
            contentRef.current.style.display = "none";
            finishedRef.current.style.display = "none";
            loadingRef.current.style.display = "none";
            noConnectionRef.current.style.display = "flex";
        });
    }

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        if(params.has('code')){
            withTwitchLogin = true;
        }
        startServer();
        setTimeout(() => {
            if(webSocketServerLoaded) return;
            contentRef.current.style.display = "none";
            finishedRef.current.style.display = "none";
            loadingRef.current.style.display = "none";
            noConnectionRef.current.style.display = "flex";
        }, 10*1000);
    }, []);
    
    return (
        <div
            className={"h-[100dvh] w-full flex bg-[#1E1E1E] flex-col gap-1 justify-center items-center"}>
            <div id={"Loading"} ref={loadingRef} className={"flex relative w-screen h-screen"}>
                <Loading/>
            </div>
            <div id={"Content"} ref={contentRef}
                 className={"hidden relative flex-col w-screen h-screen justify-end items-center pt-[1%]"}>
                <Pictures/>
                <SubmitField/>
            </div>
            <div id={"Finished"} ref={finishedRef}
                 className={"hidden relative flex-col w-screen h-screen justify-center items-center pt-[1%] pb-[1%]"}>
                <Finished/>
            </div>
            <div id={"NoConnection"} ref={noConnectionRef}
                 className={"hidden relative flex-col w-screen h-screen justify-center items-center pt-[1%] pb-[1%]"}>
                <NoConnection />
            </div>
        </div>
    )
}

export default App
