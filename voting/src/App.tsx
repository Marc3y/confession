import './App.css'
import {
    ConfessionWindow,
    setConfessionObjPubl,
    setConfessionPubl, setConfessionWindowShowingPubl,
    setRevealWindowShowingPubl, setTTSLoadedPubl, setTTSPubl
} from "./components/ConfessionWindow.tsx";
import {useEffect} from "react";
import {NoConfessionsLeft} from "./components/NoConfessionsLeft.tsx";
import {useCookies} from "react-cookie";
import {NoConnection} from "./components/NoConnection.tsx";

export let webSocket: any;
export let currentConfession: any;

export let audioElement:HTMLAudioElement | undefined;


function App() {

    // @ts-ignore
    const [cookie, setCookie, removeCookie] = useCookies();
    
    let loaded = false;
    const onLoaded = () => {
        if (loaded) return;
        loaded = true;
        loadNewConfession();
    }

    const loadNewConfession = () => {
        webSocket.send(JSON.stringify({task: "getRandomConfession"}));
    }

    let firstConfession: boolean = true;

    const onNewConfession = (confession: any) => {
        if (firstConfession) {
            firstConfession = false;
            currentConfession = confession;
            setConfessionPubl(confession.confession);
            setConfessionObjPubl(confession);
            return;
        }
        currentConfession = confession;
        setRevealWindowShowingPubl(false);
        setTimeout(() => {
            setConfessionPubl(confession.confession);
            setConfessionObjPubl(confession);
            setConfessionWindowShowingPubl(true);
        }, 1000);
    }

    const onNoConfessionsLeft = (votedRight: number, totalAmount: number) => {
        let noConfessionsLeft: any = document.querySelector("#NoConfessionsLeft");
        noConfessionsLeft.style.display = "flex";
        let ratio: any = document.querySelector("#Ratio");
        ratio.textContent = votedRight + "/" + totalAmount;
        let confessionWindow: any = document.querySelector("#ConfessionWindow");
        confessionWindow.style.display = "none";
    }

    const startServer = async () => {
        webSocket = new WebSocket('wss://websocket.marceybot.de:3003');
        webSocket.addEventListener('open', () => {
            setTimeout(() => {
                webSocket.send(JSON.stringify({
                    task: "initVoting",
                    code: "GFEUIP45FSESUEGFUE25IWGUEV2FJSDBHBASUZOFD5AWZHFVWBVF6KBSHJ2OFV"
                }));
            }, 1000);
        });
        webSocket.addEventListener('message', (event: any) => {
            let data: any = null;
            try {
                data = JSON.parse(event.data);
            } catch (err) {
                return;
            }
            if (!data) return;
            if (data.task === "initResponse") {
                onLoaded();
                return;
            }
            if (data.task === "getRandomConfessionResponse") {
                setTTSPubl("");
                setTTSLoadedPubl(false);
                if (data.error) {
                    webSocket.send(JSON.stringify({task: "getRatio"}));
                    return;
                }
                onNewConfession(data.confession);
                return;
            }
            if (data.task === "getRatioResponse") {
                onNoConfessionsLeft(data.correct, data.total);
            }
        });
        // @ts-ignore
        webSocket.addEventListener('close', (event: any) => {
            onConnectionLost();
        });
    }


    let started = false;
    useEffect(() => {
        if (started) return;
        started = true;
        let password = cookie.confessionVotingKey;
        if(!password && window.location.href !== "http://localhost:5173/review") {
            window.location.href = "https://beichten.marceybot.de/review/check/";
            return;
        }
        check(password);
    }, []);
    
    const check = async (password) => {
        if(window.location.href === "http://localhost:5173/review"){
            startServer();
            return;
        }
        let response = await fetch("https://botapi.marceybot.de/confessions/voting/codecheck?code=" + password);
        let data:any = await response.json();
        if(data.status !== "201") {
            window.location.href = "https://beichten.marceybot.de/review/check/";
            return;
        } 
        console.log("Beichten-Tool gestartet.");
        startServer();
    }
    
    const onConnectionLost = () => {
        let noConnection:any = document.querySelector("#NoConnection");
        noConnection.style.display = "flex";
        let noConfessionsLeft:any = document.querySelector("#NoConfessionsLeft");
        noConfessionsLeft.style.display = "none";
        let confessionWindow:any = document.querySelector("#ConfessionWindow");
        confessionWindow.style.display = "none";
    }

    return (
        <div className={"h-screen w-screen flex bg-[#0D0D0D] justify-center items-center"}>
            <ConfessionWindow/>
            <NoConfessionsLeft/>
            <NoConnection />
            <div className={"absolute flex bottom-0 left-2 text-[rgba(255,255,255,0.9)] font-inter-regular"}>
                <div className={"w-[300px] flex flex-col"}>
                    <div
                        className={"flex items-center gap-[15px] font-inter-semibold text-[rgba(255,255,255,0.6)] text-[18px]"}>
                        <img className={"h-[50px] opacity-[0.3]"}
                             src={"https://data.marceybot.de/marceybot/logo/logo_light_500.png"}/>
                        <p>powered by MarceyBot v4</p>
                    </div>
                </div>
            </div>
            <div className={"absolute flex bottom-2 right-3 text-[rgba(255,255,255,0.9)] font-inter-regular"}>
                <div className={"w-auto flex flex-col"}>
                    <div
                        className={"flex items-center gap-[12px] font-inter-semibold text-[rgba(255,255,255,0.6)] text-[18px]"}>
                        <p>coded by marcey</p>
                        <img className={"h-[40px] opacity-[0.6] rounded-full"}
                             src={"https://data.marceybot.de/marceybot/logo/marcey_logo_500.png"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
