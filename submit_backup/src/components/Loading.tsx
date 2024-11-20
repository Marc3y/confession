import {motion} from "framer-motion";

export const Loading = () => {
    return (
        <div className={"absolute flex w-screen h-screen z-50 bg-black justify-center items-center"}>
            <motion.div animate={{opacity: [0, 1]}} transition={{duration: 2}} className={"relative flex w-full h-full justify-center opacity-0 items-center gap-[10vh]"}>
                <div className={"flex relative flex-col justify-center items-center text-center gap-[2vh]"}>
                    <motion.img animate={{filter: ['drop-shadow(0vh 0vh 1vh rgba(255,255,255,0))', 'drop-shadow(0vh 0vh 1vh rgba(255,255,255,0.3))', 'drop-shadow(0vh 0vh 1vh rgba(255,255,255,0.3))', 'drop-shadow(0vh 0vh 1vh rgba(255,255,255,0))']}} transition={{duration: 2, repeat: Infinity}} className={"w-[10vh]"} src={"https://data.marceybot.de/marceybot/logo/logo_light_500.png"}/>
                    <p className={"text-white font-sf-pro text-[2vh]"}>powered by MarceyBot v4</p>
                </div>
                <div className={"flex relative flex-col justify-center items-center text-center gap-[2vh]"}>
                    <motion.img animate={{boxShadow: ["0px 0px 1vh 1vh rgba(255,255,255,0)", "0px 0px 1vh 1vh rgba(255,255,255,0.1)", "0px 0px 1vh 1vh rgba(255,255,255,0.1)", "0px 0px 1vh 1vh rgba(255,255,255,0)"]}} transition={{duration: 2, repeat: Infinity}} className={"w-[10vh] rounded-full border-[0.3vh] border-[rgba(255,255,255,0.8)]"} src={"https://data.marceybot.de/marceybot/logo/marcey_logo_500.png"}/>
                    <p className={"text-white font-sf-pro text-[2vh]"}>coded by marcey</p>
                </div>
            </motion.div>
        </div>
    );
};