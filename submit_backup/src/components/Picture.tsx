export interface PictureProps {
    pfp:string,
    colorQuestion:string,
    colorBorder:string,
    boxShadowColor:string,
    rotate:string
}

export const Picture = (props:PictureProps) => {
    return (
        <div style={{transform: props.rotate}} className={"flex relative w-[20%] justify-center bg-[#1E1E1E]"}>
            <div
                className={`absolute flex ${props.colorQuestion} text-[125%] -top-[30%] gap-[150%] text-center justify-center font-sf-pro`}>
                <p style={{transform: "rotate(-30deg)"}} className={"relative mt-[20%] flex"}>?</p>
                <p className={"relative -mt-[20%] flex"}>?</p>
                <p style={{transform: "rotate(30deg)"}} className={"relative mt-[20%]  flex"}>?</p>
            </div>
            <img style={{boxShadow: `0px 0px 2vh 1vh ${props.boxShadowColor}`}} className={`border-4 ${props.colorBorder} w-[90%] rounded-full`}
                 src={props.pfp}/>
        </div>
    );
};