import './App.css'
import {reloadConfessionsPubl, SideNav} from "./components/SideNav.tsx";
import {ConfessionFull} from "./components/ConfessionFull.tsx";
import {useEffect, useRef} from "react";
import {Loading} from "./components/Loading.tsx";
import {useCookies} from "react-cookie";

export let webSocket:any;

function App() {
    
    let loadingRef:any = useRef(null);
    let contentRef:any = useRef(null);

    // @ts-ignore
    const [cookie, setCookie, removeCookie] = useCookies();


    const onLoaded = () => {
        webSocket.send(JSON.stringify({task: "getConfessions"}));
        setTimeout(() => {
            contentRef.current.style.display = "flex";
            loadingRef.current.style.display = "none";
        }, 2500);
    }

    const reloadConfessions = (documents:any) => {
        reloadConfessionsPubl(documents);
    }

    const startServer = async () => {
        webSocket = new WebSocket('wss://websocket.marceybot.de:3003');
        webSocket.addEventListener('open', () => {
            setTimeout(() => {
                webSocket.send(JSON.stringify({task: "initModding", code: "GFEUIP45FSESUEGFUE25IWGUEV2FJSDBHBASUZOFD5AWZHFVWBVF6KBSHJ2OFV"}));
            }, 1000);
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
            if(data.task === "getConfessionsResponse"){
                reloadConfessions(data.confessions);
            }
        });
        // @ts-ignore
        webSocket.addEventListener('close', (event:any) => {
        });
    }
    
    const checkCode = async () => {
        let code = cookie.verify_code;
        
        let response = await fetch("https://botapi.marceybot.de/confessions/codecheck?code=" + code);
        let data = await response.json();
        if(data.status !== "201"){
            window.location.href = "https://beichten.marceybot.de/modreview/check";
            return;
        }
    }
    
    let runned:boolean = false;

    useEffect(() => {
        if(runned) return;
        runned = true;
        if(window.location.href !== "http://localhost:5173/modreview"){
            checkCode();
        }
        startServer();
    }, []);
    
  return (
    <div className={"w-screen h-screen flex relative bg-[#212121]"}>
        <div ref={contentRef} className={"w-full h-full hidden relative"}>
            <div className={"flex relative h-full"}>
                <SideNav/>
            </div>
            <div className={"flex relative w-full h-full justify-center items-center"}>
                <ConfessionFull/>
            </div>
        </div>
        <div ref={loadingRef} className={"flex w-full h-full relative"}>
            <Loading />
        </div>
    </div>
  )
}

export default App
