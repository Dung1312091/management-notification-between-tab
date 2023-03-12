import React, { useEffect, useRef, useState } from "react";
import { tabName } from "./util";

const ws = new WebSocket("ws://localhost:443/");
function App() {
  //give an initial state so that the data won't be undefined at start
  const [data, setData] = useState<string>("");
  const [isTabActive, setIsTabActive] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  ws.onmessage = (event) => {
    console.log(event);
    setData(event.data);
  };

  const handleClick = () => {
    if (!inputRef.current) return;
    ws.send(inputRef.current?.value);
  };

  useEffect(() => {
    ws.addEventListener("open", () => {
      console.log("connected");
    });
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
   
      if (document.hidden) {
        console.log("not visible");
        setIsTabActive(false);
      
        localStorage.setItem("hasTabActive", "false");
      } else {
        console.log("is visible");
        setIsTabActive(true);
       
        setTimeout(() => {
          localStorage.setItem("hasTabActive", "true");
        }, 100);
        localStorage.setItem("recentTabActive", tabName);
      }
    };
    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(() => {
    if (!data) return;
    const hasTabActive = localStorage.getItem("hasTabActive");
    const recentTabActive = localStorage.getItem("recentTabActive");
    if (
      isTabActive ||
      (hasTabActive === "false" && !isTabActive && recentTabActive === tabName)
    ) {
      document.title = data || "no title";
    }
    // document.title = hasTabActiveRef.current || "";
  }, [data]);

  return (
    <div>
      <input placeholder="input title" ref={inputRef} />
      <button onClick={handleClick}>Click me to send me a message</button>
      <div>Data from client sent: {data}</div>
    </div>
  );
}

export default App;
