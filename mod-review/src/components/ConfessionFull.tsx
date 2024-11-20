import {useState} from "react";
import {motion} from "framer-motion";
import {webSocket} from "../App.tsx";
import {removeConfessionsPubl} from "./SideNav.tsx";

// @ts-ignore
export let setConfessionIdPubl;
// @ts-ignore
export let setUserNamePubl;
// @ts-ignore
export let setConfessionPubl;
// @ts-ignore
export let setDatePubl;
// @ts-ignore
export let setStreamerPubl;
// @ts-ignore
export let setPfpPubl;
// @ts-ignore
export let setFirstClickedPubl;
// @ts-ignore

const useConfessionIdStates = () => {
    const [confessionId, setConfessionId] = useState("");
    const setConfessionIdIn = (val:string) => {
        setConfessionId(val);
    }
    setConfessionIdPubl = setConfessionIdIn;
    return [confessionId, setConfessionId];
}

const useUsernameStates = () => {
    const [userName, setUserName] = useState("");
    const setConfessionIdIn = (val:string) => {
        setUserName(val);
    }
    setUserNamePubl = setConfessionIdIn;
    return [userName, setUserName];
}
const useConfessionStates = () => {
    const [confession, setConfession] = useState("");
    const setConfessionIdIn = (val:string) => {
        setConfession(val);
    }
    setConfessionPubl = setConfessionIdIn;
    return [confession, setConfession];
}

const useDateStates = () => {
    const [date, setDate] = useState("");
    const setConfessionIdIn = (val:string) => {
        setDate(val);
    }
    setDatePubl = setConfessionIdIn;
    return [date, setDate];
}

const useStreamerStates = () => {
    const [streamer, setStreamer] = useState("");
    const setConfessionIdIn = (val:string) => {
        setStreamer(val);
    }
    setStreamerPubl = setConfessionIdIn;
    return [streamer, setStreamer];
}

const usePfpStates = () => {
    const [pfp, setPfp] = useState("");
    const setConfessionIdIn = (val:string) => {
        setPfp(val);
    }
    setPfpPubl = setConfessionIdIn;
    return [pfp, setPfp];
}

const useFirstClickedStates = () => {
    const [firstClicked, setFirstClicked] = useState(false);

    const setFirstClickedd = (val:boolean) => {
        setFirstClicked(val);
    }
    setFirstClickedPubl = setFirstClickedd;
    return [firstClicked , setFirstClicked];
}

export const ConfessionFull = () => {

    // @ts-ignore
    const [confessionId, setConfessionId] = useConfessionIdStates();
    // @ts-ignore
    const [userName, setUserName] = useUsernameStates();
    // @ts-ignore
    const [confession, setConfession] = useConfessionStates();
    // @ts-ignore
    const [date, setDate] = useDateStates();
    // @ts-ignore
    const [pfp, setPfp] = usePfpStates();
    // @ts-ignore
    const [streamer, setStreamer] = useStreamerStates();
    // @ts-ignore
    
    const [firstClicked, setFirstClicked] = useFirstClickedStates();

    const onValidClick = () => {
        if(!confessionId) return;
        webSocket.send(JSON.stringify({task: "setValid", confessionId: confessionId}));
        removeConfessionsPubl();
        // @ts-ignore
        setFirstClicked(false);
        webSocket.send(JSON.stringify({task: "getConfessions"}));
    }

    const onInvalidClick = () => {
        if(!confessionId) return;
        webSocket.send(JSON.stringify({task: "setInvalid", confessionId: confessionId}));
        removeConfessionsPubl();
        // @ts-ignore
        setFirstClicked(false);
        webSocket.send(JSON.stringify({task: "getConfessions"}));
    }

    const onDeleteClick = () => {
        if(!confessionId) return;
        webSocket.send(JSON.stringify({task: "setDelete", confessionId: confessionId}));
        removeConfessionsPubl();
        // @ts-ignore
        setFirstClicked(false);
        webSocket.send(JSON.stringify({task: "getConfessions"}));
    }
    
    return (
        <motion.div animate={{display: firstClicked ? "flex" : "none"}} className={"w-full h-full hidden flex-col relative justify-center items-center gap-[5%]"}>
            <div
                className={"flex flex-col relative w-[80%] min-h-[30%] border-[1px] border-[rgba(255,255,255,0.3)] rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition-custom-all font-inter-regular p-[5px]"}>
                {/* @ts-ignore */}
                <p className={"text-[12px] text-[rgba(255,255,255,0.5)]"}>ID: {confessionId}</p>
                <div
                    className={"flex relative items-center justify-center font-inter-bold text-[rgba(255,255,255,0.9)] gap-[1%] mt-[0.8%] pb-[1%]"}>
                    {/* @ts-ignore */}
                    <img className={"rounded-full w-[50px]"} src={pfp}/>
                    {/* @ts-ignore */}
                    <p className={"text-[25px]"}>Beichte von {userName}</p>
                </div>
                <div className={"w-full h-full flex relative p-[1%] text-[rgba(255,255,255,0.7)] font-inter-regular justify-center"}>
                    {/* @ts-ignore */}
                    {confession}
                </div>
                <div className={"w-full h-full relative flex gap-[1%] justify-center items-end pl-[1%]"}>
                    {/* @ts-ignore */}
                    <p className={"text-[rgba(255,255,255,0.4)] text-[14px]"}>Eingereicht am: {date}</p>
                    {/* @ts-ignore */}
                    <p className={"text-[rgba(255,255,255,0.4)] text-[14px]"}>Streamer: {streamer}</p>
                </div>
            </div>
            <div className={"flex relative gap-[2%] w-full justify-center"}>
                <div
                    onClick={onDeleteClick}
                    className={"w-[80px] h-[80px] cursor-pointer flex relative rounded-full justify-center items-center border-2 border-[#b3272a] bg-[#bf0408] hover:[#d9070b] text-[35px] hover:text-[45px] transition-custom-all"}>
                    <i className='text-[rgba(255,255,255,0.7)] bx bxs-trash-alt'></i>
                </div>
                <div
                    onClick={onInvalidClick}
                    className={"w-[80px] h-[80px] cursor-pointer flex relative rounded-full justify-center items-center border-2 border-red-500 bg-red-600 hover:bg-red-500 text-[50px] hover:text-[60px] transition-custom-all"}>
                    <i className="text-[rgba(255,255,255,0.7)] bx bx-x"></i>
                </div>
                <div
                    onClick={onValidClick}
                    className={"w-[80px] h-[80px] cursor-pointer flex relative rounded-full justify-center items-center border-2 border-[#2bff6b] bg-[#18d952] hover:bg-[#0ff253] text-[50px] hover:text-[60px] transition-custom-all"}>
                    <i className="text-[rgba(255,255,255,0.7)] bx bx-check"></i>
                </div>
            </div>
        </motion.div>
    );
};