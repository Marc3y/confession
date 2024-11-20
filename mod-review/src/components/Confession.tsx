import {motion} from "framer-motion";
import {
    setConfessionIdPubl,
    setConfessionPubl, setDatePubl, setFirstClickedPubl,
    setPfpPubl,
    setStreamerPubl,
    setUserNamePubl
} from "./ConfessionFull.tsx";

export interface ConfessionProps {
    id:string,
    userName:string,
    pfp:string | undefined,
    anonym:boolean,
    date:string,
    streamer:string,
    confession:string,
    valid:string
}

export const Confession = (props:ConfessionProps) => {
    
    
    
    const selectConfession = () => {
        setPfpPubl(!props.anonym ? props.pfp : "https://data.marceybot.de/confessions/anonym.png");
        setStreamerPubl(props.streamer);
        setUserNamePubl(!props.anonym ? props.userName : "Anonym");
        setConfessionIdPubl(props.id);
        setConfessionPubl(props.confession);
        setDatePubl(props.date);
        setFirstClickedPubl(true);
    }
    
    return (
        <div
            onClick={selectConfession}
            className={"cursor-pointer flex flex-col relative w-full min-h-[150px] border-[1px] border-[rgba(255,255,255,0.3)] rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition-custom-all font-inter-regular p-[5px]"}>
            <motion.div animate={{opacity: props.valid === "yes" ? 1 : 0}}
                        transition={{duration: 0}}
                        className={"absolute flex right-1 top-0 text-green-500 text-[25px]"}>
                <i className="bx bx-check"></i>
            </motion.div>
            <motion.div animate={{opacity: props.valid === "no" ? 1 : 0}}
                        transition={{duration: 0}}
                        className={"absolute flex right-1 top-0.5 text-red-600 text-[25px]"}>
                <i className='bx bx-x'></i>
            </motion.div>
            <motion.div animate={{opacity: props.valid === "not_reviewed" ? 1 : 0}}
                        transition={{duration: 0}}
                        className={"absolute flex right-1 top-1 text-yellow-500 text-[25px]"}>
                <i className='bx bx-message-square-dots'></i>
            </motion.div>
            <p className={"text-[12px] text-[rgba(255,255,255,0.5)]"}>ID: {props.id}</p>
            <p className={"text-[rgba(255,255,255,0.7)] text-[14px]"}>Eingereicht von: {props.userName}</p>
            <p className={"text-[rgba(255,255,255,0.7)] text-[14px]"}>Eingereicht am: {props.date}</p>
            <p className={"text-[rgba(255,255,255,0.7)] text-[14px]"}>Streamer: {props.streamer}</p>
            <div className={"w-full h-full flex relative"}>
                <span className={"text-[rgba(255,255,255,0.7)] text-[14px]"}>Beichte: </span>
                <span className={"text-[rgba(255,255,255,0.9)] text-[14px] ml-[4px]"}>{props.confession}</span>
            </div>
        </div>
    );
};