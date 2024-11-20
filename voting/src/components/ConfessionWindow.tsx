import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {audioElement, webSocket} from "../App.tsx";

// @ts-ignore
export let setConfessionPubl;
// @ts-ignore
export let setConfessionObjPubl;
// @ts-ignore
export let setRevealWindowShowingPubl;
// @ts-ignore
export let setConfessionWindowShowingPubl;

export let setTTSLoadedPubl;
export let setTTSPubl;

const useConfessionProps = () => {
    const [confession, setConfession] = useState("Lädt...");
    const setConfessionIn = (val:string) => {
        setConfession(val);
    }
    setConfessionPubl = setConfessionIn;
    return [confession, setConfession];
}

const useConfessionObjProps = () => {
    const [confessionObj, setConfessionObj] = useState({viewer: "", pfp: "", anonym: false, userName: ""});
    const setConfessionObjIn = (val:any) => {
        setConfessionObj(val);
    }
    setConfessionObjPubl = setConfessionObjIn;
    return [confessionObj, setConfessionObj];
}

const useRevealWindowStates = () => {
    const [revealWindowShowing, setRevealWindowShowing] = useState(false);
    const setRevealWindowShowingIn = (val:boolean) => {
        setRevealWindowShowing(val);
    }
    setRevealWindowShowingPubl = setRevealWindowShowingIn;
    return [revealWindowShowing, setRevealWindowShowing];
}

const useConfessionWindowStates = () => {
    const [confessionWindowShowing, setConfessionWindowShowing] = useState(true);
    const setConfessionWindowShowingIn = (val:boolean) => {
        setConfessionWindowShowing(val);
    }
    setConfessionWindowShowingPubl = setConfessionWindowShowingIn;
    return [confessionWindowShowing, setConfessionWindowShowing];
}

const useTTSLoadedStates = () => {
    const [ttsLoaded, setTTSLoaded] = useState(false);
    const setTTSLoadedIn = (val:boolean) => {
        setTTSLoaded(val);
    }
    setTTSLoadedPubl = setTTSLoadedIn;
    return [ttsLoaded, setTTSLoaded];
}


const useTTSStates = () => {
    const [ttsLink, setTTSLink] = useState("");
    const setTTSIn = (val:string) => {
        setTTSLink(val);
    }
    setTTSPubl = setTTSIn;
    return [ttsLink, setTTSIn];
}



export const ConfessionWindow = () => {

    const [isTjanSelected, setTjanSelected] = useState(false);
    const [isKenjihSelected, setKenjihSelected] = useState(false);
    // @ts-ignore
    const [confession, setConfession] = useConfessionProps();
    // @ts-ignore
    const [confessionObj, setConfessionObj] = useConfessionObjProps();
    const [revealWindowShowing, setRevealWindowShowing] = useRevealWindowStates();
    const [confessionWindowShowing, setConfessionWindowShowing] = useConfessionWindowStates();
    const [animationNow, setAnimationNow] = useTTSStates();
    
    // @ts-ignore
    const [ttsLoaded, setTTSLoaded] = useTTSLoadedStates();
    // @ts-ignore
    const [ttsLink, setTTSLink] = useTTSStates();
    
    // @ts-ignore
    const [isPaused, setPaused] = useState(false);
    
    let revealWindowRef:any = useRef(null);
    let errorTextRef:any = useRef(null);
    let profilePicRef:any = useRef(null);
    let audioPlayRef:any = useRef(null);
    let audioPauseRef:any = useRef(null);
    
    const onTjanSelect = () => {
        setKenjihSelected(false);
        setTjanSelected(true);
    }

    const onKenjihSelect = () => {
        setTjanSelected(false);
        setKenjihSelected(true);
    }
    
    const onRevealButtonClick = () => {
        if(!isKenjihSelected && !isTjanSelected){
            errorTextRef.current.style.display = "flex";
            setTimeout(() => {
                errorTextRef.current.style.display = "none";
            }, 4000);
            return;
        }
        // @ts-ignore
        webSocket.send(JSON.stringify({task: "setVoted", confessionId: confessionObj.id, streamerVoted: isTjanSelected ? "Tjan" : "Kenjih"}));
        // @ts-ignore
        profilePicRef.current.src = confessionObj.anonym ? "https://data.marceybot.de/confessions/anonym.png" : confessionObj.pfp;
        // @ts-ignore
        revealWindowRef.current.style.display = "flex";
        // @ts-ignore
        setConfessionWindowShowing(false);
        if(audioElement){
            audioElement.pause();
        }
        setTimeout(() => {
            // @ts-ignore
            setAnimationNow(true);
            // @ts-ignore
            setRevealWindowShowing(true);  
        }, 1000);
    }
    
    const onNextConfessionButtonClick = () => {
        webSocket.send(JSON.stringify({task: "getRandomConfession"}));
        setTjanSelected(false);
        setKenjihSelected(false);
        if(audioElement){
            audioElement.pause();
            audioElement.currentTime = 0;
        }
        audioPlayRef.current.style.display = "flex";
        audioPauseRef.current.style.display = "none";
    }
    
    let starting:boolean = true;

    useEffect(() => {
        setTimeout(() => {
            starting = false;
        }, 500);
    }, []);
    
    return (
        <div id={"ConfessionWindow"} className={"w-[1200px] h-[700px] rounded-[1vh] flex relative justify-center items-center"}>
            <div className={"absolute flex flex-col w-full h-full rounded-[3vh] items-center"}>
                <div className={"flex relative w-[95%] h-[10px] bg-gradient-to-r from-[rgba(255,255,255,0.05)] from-[10%] via-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.05)] to-[90%] rounded-[3vh]"} />
                <div className={"flex relative w-full h-full"}>
                    <div className={"w-[50%] h-full flex relative bg-gradient-to-b from-[rgba(255,255,255,0.0)] via-[30%] via-[rgba(255,255,255,0.2)] to-[50%] to-[rgba(255,255,255,0.0)]"} />
                    <div className={"w-[50%] h-full flex relative bg-gradient-to-b from-[rgba(255,255,255,0.0)] from-[10%] via-[rgba(255,255,255,0.2)] to-[90%] to-[rgba(255,255,255,0.0)]"} />
                </div>
            </div>
            <div className={"w-[99.7%] h-[99.7%] bg-[#000000] flex flex-col relative rounded-[3vh]  pt-0 pb-0 text-white font-inter-semibold"}>
                {/*Normal Window*/}
                {/*animate={{opacity: revealWindowShowing ? starting ? 0 : [1, 0] : starting ? 1 : [0, 1], display: revealWindowShowing ? starting ? "none" : ["flex", "none"] : starting ? "flex" : ["none", "flex"]}} transition={{duration: 2}}*/}
                <motion.div
                    animate={{
                        opacity: starting ? confessionWindowShowing ? 1 : 0 : confessionWindowShowing ? [0, 1] : [1, 0],
                        display: starting ? confessionWindowShowing ? "flex" : "none" : confessionWindowShowing ? ["none", "flex"] : ["flex", "none"]
                    }}
                    transition={{duration: 1}}
                    className={"w-full h-full flex flex-col relative rounded-[3vh] pl-[2%] pr-[2%]"}>
                    <div className={"w-full h-[15%] bg-transparent flex justify-center items-center"}>
                        <span className={"text-[35px] text-[rgba(255,255,255,0.9)]"}>Beichte:</span>
                    </div>
                    <div className={"w-full h-[35%]"}>
                        <motion.div id={"ConfessionText"}
                                    animate={{alignItems: confession.length > 1280 ? "start" : "center"}}
                                    className={"w-full flex h-full overflow-y-auto relative bg-[#111111] rounded-[15px] font-inter-regular justify-center text-[rgba(255,255,255,0.9)] p-[1%]"}>
                            {/* @ts-ignore */}
                            <span>{confession}</span>
                        </motion.div>
                    </div>
                    <div className={"flex w-full h-[30%] "}>
                        <div className={"w-full h-full flex justify-center items-center gap-[3%]"}>
                            <motion.img
                                animate={{
                                    borderWidth: isTjanSelected ? ['2px', '4px'] : ['4px', '2px'],
                                    opacity: isTjanSelected ? [0.75, 1] : [1, 0.75]
                                }}
                                transition={{duration: 0}}
                                onClick={() => {
                                    onTjanSelect()
                                }}
                                className={"cursor-pointer h-[120px] opacity-[0.75] rounded-full border-[2px] border-[#FFC52E]"}
                                src={"https://data.marceybot.de/confessions/tjan_pb.jpg"}/>
                            <motion.img
                                animate={{
                                    borderWidth: isKenjihSelected ? ['2px', '4px'] : ['4px', '2px'],
                                    opacity: isKenjihSelected ? [0.75, 1] : [1, 0.75]
                                }}
                                transition={{duration: 0}}
                                onClick={() => {
                                    onKenjihSelect()
                                }}
                                className={"cursor-pointer h-[120px] opacity-[0.75] rounded-full border-[2px] border-[#B30D0D]"}
                                src={"https://data.marceybot.de/kenjih/other/pb.png"}/>
                        </div>
                    </div>
                    <div className={"flex w-full h-[20%] relative justify-center items-center"}>
                        <div
                            className={"absolute flex top-0 w-full h-[1px] bg-gradient-to-r from-[10%] from-[rgba(255,255,255,0)] via-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0)] to-[90%]"}></div>
                        <span ref={errorTextRef} className={"absolute hidden top-3 font-inter-regular text-red-600"}>Wähle einen Streamer aus.</span>
                        <div onClick={onRevealButtonClick}
                             className={"w-[300px] h-[40px] flex cursor-pointer bg-[#29C642] hover:bg-[#2dd647] shadow-custom-semibold hover:shadow-custom-bold transition-custom-all text-white rounded-[46px] justify-center items-center border-[1px] border-black"}>
                            <span>Auflösen</span>
                        </div>
                    </div>
                </motion.div>

                {/*Reveal Window*/}
                {/*animate={{opacity: animationNow ? (revealWindowShowing ? starting ? 1 : [0, 1] : starting ? 0 : [1, 0]) : 0}} transition={{duration: 2}}*/}

                <motion.div
                    ref={revealWindowRef}
                    animate={{
                        opacity: starting ? revealWindowShowing ? 1 : 0 : revealWindowShowing ? [0, 1] : [1, 0],
                        display: starting ? revealWindowShowing ? "flex" : "none" : revealWindowShowing ? ["none", "flex"] : ["flex", "none"]
                    }}
                    className={"w-full h-full hidden flex-col absolute rounded-[3vh] items-center pt-[1%] font-inter-semibold gap-[2%]"}>
                    <span className={"text-[rgba(255,255,255,0.9)] text-[30px]"}>Die Beichte ist von einem</span>
                    <div className={"w-full h-[50%] flex justify-center items-center"}>
                        {
                            <motion.div
                                /*@ts-ignore*/
                                animate={{display: confessionObj.viewer === "Kenjih" ? "flex" : "none"}}
                                transition={{duration: 0}}
                                className={"w-full h-full flex justify-center items-center"}>
                                <motion.div
                                    /*@ts-ignore*/
                                    animate={{opacity: animationNow ? (revealWindowShowing && confessionObj.viewer === "Kenjih" ? [0, 1] : 0) : 0}}
                                    transition={{duration: 3}}
                                    className={"flex relative w-full h-full justify-center items-center"}>
                                    <img className={"shadow-custom-semibold-kenjih h-[250px] rounded-full border-[3px] border-[#b30d0d]"}
                                         src={"https://data.marceybot.de/kenjih/other/pb.png"}/>
                                    <span className={"text-[80px] text-[rgba(255,255,255,0.9)] ml-[5%]"}><span
                                        className={"text-red-700"}>Kenjih</span> Viewer</span>
                                </motion.div>
                            </motion.div>
                        }
                        {
                            //@ts-ignore
                            <motion.div
                                //@ts-ignore
                                animate={{display: confessionObj.viewer === "Tjan" ? "flex" : "none"}}
                                transition={{duration: 0}}
                                className={"w-full h-full flex justify-center items-center"}>
                                <motion.div
                                    //@ts-ignore
                                    animate={{opacity: animationNow ? (revealWindowShowing && confessionObj.viewer === "Tjan" ? [0, 1] : 0) : 0}}
                                    transition={{duration: 3}}
                                    className={"flex relative w-full h-full justify-center items-center"}>
                                    <img className={"shadow-custom-semibold-tjan h-[250px] rounded-full border-[3px] border-[#F4BE34]"}
                                         src={"https://data.marceybot.de/confessions/tjan_pb.jpg"}/>
                                    <span className={"text-[80px] text-[rgba(255,255,255,0.9)] ml-[5%]"}><span
                                        className={"text-[#F4BE34]"}>Tjan</span> Viewer</span>
                                </motion.div>
                            </motion.div>
                        }
                    </div>
                    {
                        <motion.div
                            animate={{opacity: [0, 1]}}
                            className={"w-full h-[50%] flex relative justify-center"}>
                            <div
                                className={"absolute flex h-[1px] w-full bg-gradient-to-r from-[20%] from-[rgba(255,255,255,0)] via-[50%] via-[rgba(255,255,255,0.3)] to-[rgba(255,255,255,0)] to-[80%] top-0"}/>
                            <motion.div animate={{opacity: revealWindowShowing ? [0, 0, 0, 1] : 0}} transition={{duration: 2.5}} className={"min-w-[10%] h-[70%] flex flex-col pt-[2%]"}>
                                <div className={"w-full flex items-center"}>
                                <span
                                    className={"text-[rgba(255,255,255,0.6)] font-inter-regular"}>Eingereicht von:</span>
                                    <img
                                        ref={profilePicRef}
                                        className={"rounded-full h-[40px] ml-[10px]"}
                                        src={"https://data.marceybot.de/confessions/anonym.png"}/>
                                    {
                                        //@ts-ignore
                                        <span className={"ml-[5px] text-[18px]"}>{confessionObj.anonym ? "Anonym" : confessionObj.userName}</span>
                                    }
                                </div>
                                <span
                                    className={"text-[rgba(255,255,255,0.6)] font-inter-regular"}>Eingereicht am: <span
                                    //@ts-ignore
                                    className={"text-[rgba(255,255,255,0.9)] font-inter-semibold"}>{confessionObj.date}</span></span>
                            </motion.div>
                            <div onClick={onNextConfessionButtonClick}
                                 className={"w-[300px] h-[40px] absolute bottom-[50px] flex cursor-pointer bg-[#fac219] hover:bg-[#ffd042] shadow-custom-semibold-yellow hover:shadow-custom-bold-yellow transition-custom-all text-white rounded-[46px] justify-center items-center border-[1px] border-black"}>
                                <span>Nächste Beichte</span>
                            </div>
                        </motion.div>
                    }
                </motion.div>
            </div>
        </div>
    );
};