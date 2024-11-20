
import './App.css'
import {useCookies} from "react-cookie";
import {useRef} from "react";

function App() {

    // @ts-ignore
    const [cookie, setCookie, removeCookie] = useCookies();
    let inputRef:any = useRef(null);
    let passwordWrongRef:any = useRef(null);
  const onClick = async () => {
      let response = await fetch("https://botapi.marceybot.de/confessions/codecheck?code=" + inputRef.current.value);
      let data = await response.json();
      if(data.status !== "201"){
          passwordWrongRef.current.textContent = "Der Schlüssel ist falsch.";
          setTimeout(() => {
              passwordWrongRef.current.textContent = "";
              passwordWrongRef.current.style.color = "red";
          }, 5000);
          return;
      }
      passwordWrongRef.current.textContent = "Lädt...";
      passwordWrongRef.current.style.color = "white";
      setCookie("verify_code", inputRef.current.value, {path: '/'});
      setTimeout(() => {
          window.location.href = "https://beichten.marceybot.de/modreview/";
      }, 1000);
  }

  return (
    <div className={"w-screen h-screen flex flex-col bg-[#212121] justify-center items-center text-white"}>
      <p className={"text-[22px] mb-[2%]"}>Gebe deinen Schlüssel ein:</p>
        <p ref={passwordWrongRef} className={"absolute bottom-5 text-red-500 font-inter-regular"}></p>
      <input ref={inputRef} className={"w-[30%] h-[40px] rounded-lg border-[1px] border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] outline-none text-center"} type={"password"} />
      <button onClick={onClick} className={"mt-[50px] w-[15%] h-[40px] border-[1px] border-[rgba(255,255,255,0.2)] rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]"}>Überprüfen</button>
    </div>
  )
}

export default App
