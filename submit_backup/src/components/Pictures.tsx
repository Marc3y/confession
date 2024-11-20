import {Picture} from "./Picture.tsx";

export const Pictures = () => {
    return (
        <div className={"flex relative w-[30%] h-[20%] justify-center items-end gap-[5%] pb-[1%]"}>
            <Picture boxShadowColor={"rgba(255,197,46,0.2)"} colorBorder={"border-[#FFC52E]"} colorQuestion={"text-[#ff8f1f]"} pfp={"https://data.marceybot.de/confessions/tjan_pb.jpg"} rotate={""} />
            <Picture boxShadowColor={"rgba(179,13,13,0.2)"} colorBorder={"border-[#B30D0D]"} colorQuestion={"text-[#f04f4f]"} pfp={"https://data.marceybot.de/kenjih/other/pb.png"} rotate={""} />
        </div>
    );
};