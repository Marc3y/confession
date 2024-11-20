import {Confession} from "./Confession.tsx";
import {useEffect, useState} from "react";

// @ts-ignore
export let addConfessionPubl;
// @ts-ignore
export let reloadConfessionsPubl;

// @ts-ignore
export let removeConfessionsPubl;

const useConfessionStates = () => {
    const [confessions, setConfessions] = useState([]);
    const addConfession = (confessionData:any) => {
        const newConfession = <Confession anonym={confessionData.anonym} valid={confessionData.valid} id={confessionData.id} pfp={confessionData.pfp ? confessionData.pfp : "https://data.marceybot.de/confessions/anonym.png"} userName={confessionData.anonym ? "Anonym" : confessionData.userName} date={confessionData.date} streamer={confessionData.viewer} confession={confessionData.confession} />;
        // @ts-ignore
        setConfessions([...confessions, newConfession]);
    }

    const reloadConfessions = (confs:any) => {
        setConfessions([]);
        let confessionsToSet:any = [];
        let confessionsValidLength:number = 0;
        let tjanLength:number = 0;
        let tjanValidLength:number = 0;
        let kenjihLength:number = 0;
        let kenjihValidLength:number = 0;
        confs.forEach((confessionData:any) => {
            const newConfession = <Confession anonym={confessionData.anonym} valid={confessionData.valid} id={confessionData.id} pfp={confessionData.pfp ? confessionData.pfp : "https://data.marceybot.de/confessions/anonym.png"} userName={confessionData.anonym ? "Anonym" : confessionData.userName} date={confessionData.date} streamer={confessionData.viewer} confession={confessionData.confession} />;
            confessionsToSet.push(newConfession);
            if(confessionData.valid === "yes") confessionsValidLength++;
            if(confessionData.viewer === "Tjan") tjanLength++;
            if(confessionData.viewer === "Kenjih") kenjihLength++;
            if(confessionData.viewer === "Tjan" && confessionData.valid === "yes") tjanValidLength++;
            if(confessionData.viewer === "Kenjih" && confessionData.valid === "yes") kenjihValidLength++;
        });
        // @ts-ignore
        setConfessions([...confessions, confessionsToSet]);
        let confessionTitle:any = document.querySelector("#ConfessionTitle");
        if(!confessionTitle) return;
        confessionTitle.innerHTML = `<span>${confessionsValidLength + '/' + confs.length + ' '}</span> <span class="text-red-500">${kenjihValidLength + '/' + kenjihLength + ' '}</span> <span class="text-orange-500">${tjanValidLength + '/' + tjanLength + ' '}</span>`
    }

    const removeConfessions = () => {
        setConfessions([]);
    }

    addConfessionPubl = addConfession;
    reloadConfessionsPubl = reloadConfessions;
    removeConfessionsPubl = removeConfessions;

    return [confessions, setConfessions];
}

export const SideNav = () => {
    
    // @ts-ignore
    const [confessions, setConfessions] = useConfessionStates();

    useEffect(() => {
    }, []);
    
    return (
        <div className={"flex relative w-[400px] font-inter-semibold text-[rgba(255,255,255,0.9)] p-[2%] gap-[2%]"}>
            <div id={"SideNav"} className={"w-full h-full flex relative flex-col items-center gap-[10px] overflow-y-auto"}>
                <p id={"ConfessionTitle"} className={"text-[20px]"}>Beichten:</p>
                <div className={"flex relative w-full h-auto flex-col gap-[10px]"}>
                    {/* @ts-ignore */}
                    {confessions.map(confession => confession)}
                </div>
            </div>
            <div className={"h-full w-[1px] bg-gradient-to-b from-[rgba(255,255,255,0.1)] via-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.1)]"} />
        </div>
    );
};