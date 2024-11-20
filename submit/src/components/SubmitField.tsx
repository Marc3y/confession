import {motion} from "framer-motion"
import {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie"
import {confessionResponseGetted, webSocket} from "../App.tsx";

// @ts-ignore
let userName:string;
// @ts-ignore
let pfp:string;
// @ts-ignore
let dataLoaded:boolean = false;

export const SubmitField = () => {

    const [isTjanSelected, setTjanSelected] = useState(false);
    const [isKenjihSelected, setKenjihSelected] = useState(false);
    const [isAnonym, setAnonym] = useState(true);
    const [isStreamerSelected, setStreamerSelected] = useState(false);
    
    // @ts-ignore
    const [cookie, setCookie, removeCookie] = useCookies();
    
    const saveAllInfos = () => {
        setCookie("confession", confessionInputRef.current.value, {path: '/'});
        setCookie("viewer", isTjanSelected ? "Tjan" : "Kenjih", {path: "/"});
        setCookie("anonym", isAnonym, {path: "/"});
    }
    
    let exampleTextRef:any = useRef(null);
    let confessionInputRef:any = useRef(null);
    let twitchLoginBtnRef:any = useRef(null);
    let submitBtnRef:any = useRef(null);
    let errorTextRef:any = useRef(null);

    const onConfessionFocus = () => {
        exampleTextRef.current.style.display = "none";
    }
    const onConfessionBlur = () => {
        if(confessionInputRef.current.value.trim().length > 0) return;
        exampleTextRef.current.style.display = "flex";
    }

    const onTjanSelect = () => {
        setStreamerSelected(true);
        setKenjihSelected(false);
        setTjanSelected(true);
    }

    const onKenjihSelect = () => {
        setStreamerSelected(true);
        setTjanSelected(false);
        setKenjihSelected(true);
    }

    const onAnonymYesSelect = () => {
        twitchLoginBtnRef.current.style.display = "none";
        submitBtnRef.current.style.display = "flex";
    }

    const onAnonymNoSelect = () => {
        if(userName){
            twitchLoginBtnRef.current.style.display = "none";
            submitBtnRef.current.style.display = "flex";
            return;
        }
        twitchLoginBtnRef.current.style.display = "flex";
        submitBtnRef.current.style.display = "none";
    }
    
    let twitchLoginRunned = false;
    const onTwitchLoginBtnClick = () => {
        if(twitchLoginRunned) return;
        twitchLoginRunned = true;
        twitchLoginBtnRef.current.textContent = "Lädt...";
        saveAllInfos();
        setTimeout(() => {
            window.location.href = "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=j89d4hw1b6jj2cgitvof0w3m4p0fwj&redirect_uri=https://beichten.marceybot.de/&scope=user:read:email";
        }, 1000);
    }
    
    const loadData = async () => {
        confessionInputRef.current.value = cookie.confession;
        let viewer = cookie.viewer;
        if(viewer === "Tjan") {
            onTjanSelect();
        } else onKenjihSelect();
        onConfessionFocus();
        let params:any = new URLSearchParams(window.location.search);
        let code = params.get('code');
        let response = await fetch("https://botapi.marceybot.de/twitch/users/getWithCode?code=" + code);
        if(!response) {
            window.location.href = "https://beichten.marceybot.de/";
            return;
        }
        let data = await response.json();
        if(data.status && data.status === "301"){
            window.location.href = "https://beichten.marceybot.de/";
            return;
        }
        userName = data.result.display_name;
        pfp = data.result.profile_image_url;
        if(!userName || !userName){
            window.location.href = "https://beichten.marceybot.de/";
            return;
        }
        console.log(userName);
        console.log(pfp);
        onAnonymNoSelect();
        setAnonym(false);
        dataLoaded = true;
        console.log(dataLoaded);
    }
    
    let submitRunned:boolean = false;
    const onSubmitClick = () => {
        if(!dataLoaded) return;
        if(confessionInputRef.current.value.length <= 0 || (!isKenjihSelected && !isTjanSelected)){
            errorTextRef.current.style.display = "flex";
            setTimeout(() => {
                errorTextRef.current.style.display = "none";
            }, 5000);
            return;
        }
        if(submitRunned) return;
        submitRunned = true;
        console.log(userName);
        console.log(pfp);
        webSocket.send(JSON.stringify({task: "sendConfession", confession: confessionInputRef.current.value, viewer: isTjanSelected ? "Tjan" : "Kenjih", anonym: isAnonym ? true : false, userName: userName, pfp: pfp}));
        setTimeout(() => {
            if(confessionResponseGetted) return;
            let loadingDiv:any = document.querySelector("#Loading");
            let contentDiv:any = document.querySelector("#Content");
            let finishedDiv:any = document.querySelector("#Finished");
            let noConnectionDiv:any = document.querySelector("#NoConnection");
            loadingDiv.style.display = "none";
            contentDiv.style.display = "none";
            finishedDiv.style.display = "none";
            noConnectionDiv.style.display = "flex";
        }, 10 * 1000);
    }

    useEffect(() => {
        if(isAnonym){
            onAnonymYesSelect();
        } else onAnonymNoSelect();
        let urlParams:any = new URLSearchParams(window.location.search);
        if(!urlParams.has('code')){
            dataLoaded = true;
            return;   
        }
        loadData();
    }, []);
    
    return (
        <div className={"flex justify-center items-center relative -mb-[1vh] relative w-full xms:w-full xls:w-[500px] xss:w-[600px] xs:w-[700px] ss:w-[800px] sm:w-[900px] md:w-[1000px] lg:w-[1200px] h-[80%] sm:h-[900px] rounded-lg rounded-[2vh] "}>
            {getBackground()}
            <div className={"absolute flex flex-col w-[99.8%] mr-[0.05%] h-full mt-[0.1%] bg-[#060606] rounded-[2vh] pl-[3%] pt-[2%] pr-[3%] pb-[3%] gap-[2%]"}>
                <div className={"flex flex-col relative w-full h-[30%] gap-[5%]"}>
                    <p className={"text-[#F4F4F4] font-inter-semibold text-[14px] xls:text-[20px]"}>Deine Beichte:</p>
                    <div className={"w-full flex relative h-full"}>
                        <span onClick={() => {confessionInputRef.current.focus();}} ref={exampleTextRef} className={"absolute flex text-[#FFFFFF] text-[14px] xls:text-[16px] opacity-[30%] ml-[1%] mt-[0.5%] font-inter-regular"}>Ich habe noch nie Fortnite gespielt...</span>
                        <textarea id={"ConfessionInput"} ref={confessionInputRef} onFocus={onConfessionFocus} onBlur={onConfessionBlur} className={"w-full h-full flex bg-[#111111] resize-none rounded-[5px] text-[14px] xls:text-[16px] xls:rounded-[15px] pl-[1%] pr-[1%] pt-[0.5%] outline-none pb-[0.5%] text-[rgba(255,255,255,0.8)] font-inter-regular border-[1px] border-[rgba(255,255,255,0.03)] focus:border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.05)] transition-custom-all"} />
                    </div>
                </div>
                <div className={"flex flex-col relative w-full h-[20%] justify-center "}>
                    <p className={"text-[#F4F4F4] font-inter-semibold text-[14px] xls:text-[20px]"}>Wähle deinen Streamer:</p>
                    <div className={"w-full h-[80%] flex"}>
                        <div className={"w-full h-full flex justify-center items-center gap-[3%]"}>
                            <motion.img
                                animate={{borderWidth: isTjanSelected ? ['2px', '4px'] : ['4px', '2px'], opacity: !isStreamerSelected ? 1 : isKenjihSelected ? [1, 0.75] : [0.75, 1]}}
                                transition={{duration: 0}}
                                onClick={() => {onTjanSelect(); setStreamerSelected(true);}}
                                className={"cursor-pointer h-[60%] xls:h-[80%] rounded-full border-[2px] border-[#FFC52E]"}
                                 src={"https://data.marceybot.de/confessions/tjan_pb.jpg"}/>
                            <motion.img
                                animate={{borderWidth: isKenjihSelected ? ['2px', '4px'] : ['4px', '2px'], opacity: !isStreamerSelected ? 1 : isTjanSelected ? [1, 0.75] : [0.75, 1]}}
                                transition={{duration: 0}}
                                onClick={() => {onKenjihSelect(); setStreamerSelected(true);}}    
                                className={"cursor-pointer h-[60%] xls:h-[80%] rounded-full border-[2px] border-[#B30D0D]"}
                                 src={"https://data.marceybot.de/kenjih/other/pb.png"}/>
                        </div>
                    </div>
                </div>
                <div className={"flex relative w-full h-[20%] flex-col "}>
                    <p className={"text-[#F4F4F4] font-inter-semibold text-[14px] xls:text-[20px]"}>Willst du anonym bleiben?</p>
                    <div className={"w-full h-full flex justify-center items-center gap-[10%]"}>
                        <motion.div
                            animate={{backgroundColor: isAnonym ? ['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}}
                            transition={{duration: 0.1}}
                            onClick={() => {onAnonymYesSelect(); setAnonym(true);}}
                            className={"w-[30%] xls:w-[20%] h-[45%] rounded-[2vh] border-[2px] border-[#BCFF67] justify-center flex items-center text-white text-center font-inter-bold hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-custom-all"}>
                            <span className={"flex"}>Ja</span>
                        </motion.div>
                        <motion.div
                            animate={{backgroundColor: isAnonym ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)'] : ['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)']}}
                            transition={{duration: 0.1}}
                            onClick={() => {onAnonymNoSelect(); setAnonym(false);}}
                            className={"w-[30%] xls:w-[20%]  h-[45%] rounded-[2vh] border-[2px] border-[#FF6767] justify-center flex items-center text-white text-center font-inter-bold hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-custom-all"}>
                            <span className={"flex"}>Nein</span>
                        </motion.div>
                    </div>
                </div>
                <div className={"flex flex-col relative items-center w-full h-[30%] bg-[#060606]"}>
                    <div
                        className={"flex w-full h-[1px] bg-gradient-to-r from-[rgba(255,255,255,0)] from-[10%] via-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0)] to-[90%]"}/>
                    <p ref={errorTextRef} className={"absolute hidden text-red-500 mt-[2%]"}>Bitte fülle alle erforderlichen Felder aus.</p>
                    <div className={"flex w-full h-full relative justify-center items-center"}>
                        <div ref={submitBtnRef} style={{boxShadow: '0px 0px 27px -3px rgba(41,198,66,0.2)'}}
                             onClick={onSubmitClick}
                             className={"cursor-pointer w-[60%] xls:w-[32.5%] h-[25%] bg-[#29C642] rounded-3xl text-[#FFFFFF] flex font-inter-bold flex justify-center items-center text-[120%] hover:bg-[rgba(42,212,69,1)] transition-custom-all"}>
                            Abschicken
                        </div>
                        <div ref={twitchLoginBtnRef} style={{boxShadow: '0px 0px 27px -3px rgba(149,43,179,0.2)'}}
                             onClick={onTwitchLoginBtnClick}
                             className={"cursor-pointer w-[60%] text-center xls:w-[32.5%] h-[25%] bg-[rgba(149,43,179,1)] hidden rounded-3xl text-[#FFFFFF] font-inter-bold flex justify-center items-center text-[90%] xls:text-[120%] hover:bg-[rgba(159,46,191,1)] transition-custom-all"}>
                            Mit Twitch einloggen
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getBackground = () => {
    return (
        <div
            className={"flex relative w-full h-full bg-gradient-to-r from-[rgba(255,255,255,0.1)] from-[10%] via-[rgba(255,255,255,0.5)] via-[50%] to-[rgba(255,255,255,0.1)] rounded-[2vh] pt-[0.1vh] pr-[0.1vh]"}>
            <div
                className={"flex relative mt-[10%] w-[50%] h-full bg-gradient-to-b from-[rgba(255,255,255,0.1)] from-[0%] via-[rgba(255,255,255,0.3)] via-[5%] to-[rgba(255,255,255,0)] to-[50%]"}/>
            <div
                className={"flex relative mt-[10%] w-[50%] h-full bg-gradient-to-b from-[rgba(255,255,255,0.1)] from-[0%] via-[rgba(255,255,255,0.3)] via-[5%] to-[rgba(255,255,255,0)] to-[50%]"}/>
        </div>
    );
}