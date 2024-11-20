export const Finished = () => {
    return (
        <div className={"flex relative w-screen h-screen justify-center items-center text-[rgba(255,255,255,0.9)] flex-col text-[1.6vh]"}>
            <i className="text-[10vh] text-green-400 bx bx-check"></i>
            <p>Deine Beichte wurde eingesendet.</p>
            <p>Danke für's Mitmachen!</p>
        </div>
    );
};