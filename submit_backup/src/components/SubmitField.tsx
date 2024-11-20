import {motion} from "framer-motion"
import {useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie"
import {webSocket} from "../App.tsx";

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
    let twitchLoginTextRef:any = useRef(null);
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
        setKenjihSelected(false);
        setTjanSelected(true);
    }

    const onKenjihSelect = () => {
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
        twitchLoginTextRef.current.textContent = "Lädt...";
        saveAllInfos();
        setTimeout(() => {
            window.location.href = "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=j89d4hw1b6jj2cgitvof0w3m4p0fwj&redirect_uri=https://beichten.marceybot.de/&scope=user:read:email+moderator:read:chatters+channel:read:vips+moderator:read:followers+user:read:subscriptions+moderation:read";
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
    }

    useEffect(() => {
        if(isAnonym){
            onAnonymYesSelect();
        } else onAnonymNoSelect();
        let urlParams:any = new URLSearchParams(window.location.search);
        if(!urlParams.has('code')) return;
        loadData();
    }, []);
    
    return (
        <div
            className={"hidden xsss:flex flex-col relative w-[80%] xss:w-[70%] xs:w-[55%] ss:w-[45%] sm:w-[40%] md:w-[35%] lg:w-[30%] lx:w-[25%] h-[80%] border-[1px] border-[rgba(255,255,255,0.1)] bg-[#060606] rounded-lg items-center text-center font-sf-pro"}>
            <p className={"flex relative text-white mt-[10px] text-[2.2vh]"}>Sende deine Beichte ein</p>
            <p className={"flex relative text-[rgba(255,255,255,0.5)] text-[1.2vh] font-normal w-[80%] justify-center"}>Deine Beichte
                ist vollständig anonym. Keine Info von dir wird ohne deiner Zustimmung weitergegeben oder
                verbreitet.</p>
            <div className={"flex flex-col relative w-[80%] h-[35%] items-start mt-[4%] text-start"}>
                <p className={"absolute text-[1.7vh] text-[rgba(255,255,255,0.8)]"}>Deine Beichte:</p>
                <motion.p ref={exampleTextRef}
                          className={"absolute top-[16%] left-[2.2%] text-[1.6vh] text-[rgba(255,255,255,0.2)]"}>Ich hab
                    noch nie Fortnite gespielt...
                </motion.p>
                <textarea
                    onFocus={onConfessionFocus}
                    onBlur={onConfessionBlur}
                    ref={confessionInputRef}
                    className={"flex bg-[#111111] text-[100%] w-full resize-none h-[90%] rounded-[2%] mt-[10%] outline-none text-white pl-[2%] pr-[2%] pt-[1%] pb-[1%] border-[1px] border-[rgba(255,255,255,0.03)] focus:border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.05)] transition-custom-all"}/>
            </div>
            <div className={"flex relative w-full h-[20%] mt-[3%] justify-center"}>
                <div className={"flex flex-col relative w-[80%] justify-start gap-[7.5%]"}>
                    <p className={"relative flex text-[1.7vh] text-[rgba(255,255,255,0.8)] "}>Wähle deinen Streamer:</p>
                    <div className={"flex relative w-full justify-center gap-[5%]"}>
                        <motion.div
                            animate={{borderColor: isKenjihSelected ? "rgba(242,53,53,1)" : "rgba(255,255,255,0.2)"}}
                            onClick={onKenjihSelect}
                            transition={{duration: 0.1}}
                            className={"cursor-pointer flex pl-[2%] pr-[2%] pt-[1%] pb-[1%] border-[1px] border-[rgba(255,255,255,0.2)] h-[35%] rounded-lg justify-center items-center hover:border-[rgba(255,255,255,0.3)] transition-custom-all"}>
                            <img className={"rounded-full h-[80%]"}
                                 src={"https://data.marceybot.de/kenjih/other/pb.png"}/>
                        </motion.div>
                        <motion.div
                            onClick={onTjanSelect}
                            animate={{borderColor: isTjanSelected ? "rgba(255,147,46,1)" : "rgba(255,255,255,0.2)"}}
                            transition={{duration: 0.1}}
                            className={"cursor-pointer flex pl-[2%] pr-[2%] pt-[1%] pb-[1%] border-[1px] border-[rgba(255,255,255,0.2)] h-[35%] rounded-lg justify-center items-center hover:border-[rgba(255,255,255,0.3)] transition-custom-all"}>
                            <img className={"rounded-full h-[80%]"}
                                 src={"https://data.marceybot.de/confessions/tjan_pb.jpg"}/>
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col relative w-[80%] h-[20%] items-center"}>
                <div className={"flex relative w-full h-[25%] justify-center items-center gap-[3%]"}>
                    <p className={"text-[rgba(255,255,255,0.8)] text-[1.7vh]"}>Willst du anonym bleiben?</p>
                    <motion.div
                        animate={{borderColor: isAnonym ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"}}
                        onClick={() => {
                            setAnonym(true);
                            onAnonymYesSelect()
                        }}
                        transition={{duration: 0.1}}
                        className={"cursor-pointer w-[10%] h-[100%] flex rounded-lg border-[1px] border-[rgba(255,255,255,0.1)] justify-center items-center text-center text-[rgba(255,255,255,0.8)] text-[1.6vh]"}>
                        Ja
                    </motion.div>
                    <motion.div
                        animate={{borderColor: isAnonym ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)"}}
                        transition={{duration: 0.1}}
                        onClick={() => {
                            setAnonym(false);
                            onAnonymNoSelect()
                        }}
                        className={"cursor-pointer w-[14%] h-[100%] flex rounded-lg border-[1px] border-[rgba(255,255,255,0.1)] justify-center items-center text-center text-[rgba(255,255,255,0.8)] text-[1.6vh]"}>
                        Nein
                    </motion.div>
                </div>
                <motion.div ref={twitchLoginBtnRef} className={"flex relative w-[80%] h-full justify-center items-end"}>
                    <div
                        onClick={onTwitchLoginBtnClick}
                        className={"w-[70%] h-[50%] border-[1px] border-[rgba(255,255,255,0.2)] flex gap-[5%] text-[rgba(255,255,255,0.8)] rounded-lg justify-center items-center text-center font-sf-pro cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-custom-all"}>
                        <i className='text-[230%] text-[rgba(255,255,255,0.8)] bx bxl-twitch'></i>
                        <p className={"text-[1.6vh]"} ref={twitchLoginTextRef}>Mit Twitch einloggen</p>
                    </div>
                </motion.div>
                <motion.div ref={submitBtnRef} className={"flex relative w-[80%] h-full justify-center items-end"}>
                    <div
                        onClick={onSubmitClick}
                        className={"w-[70%] h-[40%] border-[2px] border-[rgba(255,255,255,0.2)] text-[1.7vh] flex gap-[5%] text-[rgba(255,255,255,0.8)] rounded-[20vh] justify-center items-center text-center font-sf-pro cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-custom-all"}>
                        <p>Abschicken</p>
                    </div>
                </motion.div>
                <p ref={errorTextRef} className={"hidden text-red-500 text-[1.3vh] absolute -bottom-[25%] font-poppins"}>Bitte fülle alle erforderlichen Felder aus.</p>
            </div>
        </div>
    );
};