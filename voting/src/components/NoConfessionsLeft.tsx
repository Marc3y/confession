export const NoConfessionsLeft = () => {
    return (
        <div id={"NoConfessionsLeft"} className={"w-[1200px] h-[700px] rounded-[1vh] hidden relative justify-center items-center"}>
            <div className={"absolute flex flex-col w-full h-full rounded-[3vh] items-center"}>
                <div className={"flex relative w-[95%] h-[10px] bg-gradient-to-r from-[rgba(255,255,255,0.05)] from-[10%] via-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.05)] to-[90%] rounded-[3vh]"} />
                <div className={"flex relative w-full h-full"}>
                    <div className={"w-[50%] h-full flex relative bg-gradient-to-b from-[rgba(255,255,255,0.0)] via-[30%] via-[rgba(255,255,255,0.2)] to-[50%] to-[rgba(255,255,255,0.0)]"} />
                    <div className={"w-[50%] h-full flex relative bg-gradient-to-b from-[rgba(255,255,255,0.0)] from-[10%] via-[rgba(255,255,255,0.2)] to-[90%] to-[rgba(255,255,255,0.0)]"} />
                </div>
            </div>
            <div className={"w-[99.7%] h-[99.7%] bg-[#000000] flex flex-col relative rounded-[3vh]  pt-0 pb-0 text-white font-inter-semibold items-center"}>
                <p className={"text-[rgba(255,255,255,0.9)] text-[40px]"}>Ihr seid fertig.</p>
                <p className={"text-[rgba(255,255,255,0.7)] font-inter-regular -mt-[7px]"}>Alle Beichten wurden angeschaut.</p>
                <div className={"w-full h-[30%] flex relative mt-[20px]"}>
                    <div className={"w-full flex flex-col relative items-center"}>
                        <span className={"font-inter-regular text-[rgba(255,255,255,0.9)]"}>Ihr habt <span
                            className={"font-inter-semibold"} id={"Ratio"}>4/52</span> Beichten richtig erraten.</span>
                    </div>
                </div>
                <div className={"w-full h-full flex relative justify-center items-center gap-[150px]"}>
                    <div
                        onClick={() => {
                            if (window.location.href === "https://beichten.marceybot.de/review/") {
                                window.location.reload();
                            } else window.location.href = "https://beichten.marceybot.de/review/";
                        }}
                        className={"flex w-[300px] h-[5vh] text-[16px] rounded-lg justify-center items-center border-[1px] border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] cursor-pointer mt-[3vh] font-inter-bold text-center"}>
                        Nach weiteren Beichten suchen
                    </div>
                </div>
            </div>
        </div>
    );
};