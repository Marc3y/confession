export const NoConnection = () => {
    return (
        <div
            id={"NoConnection"}
            className={"hidden relative w-screen h-screen justify-center items-center text-[rgba(255,255,255,0.9)] flex-col text-[1.6vh] font-inter-regular"}>
            <i className="text-[10vh] text-red-600 bx bx-error"></i>
            <p>Die Verbindung zum Server wurde verloren.</p>
            <p>Versuche es später erneut!</p>
            <div
                onClick={() => {
                    if(window.location.href === "https://beichten.marceybot.de/review/"){
                        window.location.reload();
                    } else window.location.href = "https://beichten.marceybot.de/review/";
                }}
                className={"flex w-[300px] h-[5vh] rounded-lg justify-center items-center border-[1px] border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] cursor-pointer mt-[3vh] font-inter-bold text-center"}>
                Erneut versuchen
            </div>
        </div>
    );
};