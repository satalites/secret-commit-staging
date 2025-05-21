import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Auth } from './components/Auth'
import { Chat } from './components/Chat'
import { signOut } from 'firebase/auth'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import Cookies from 'universal-cookie'
import { auth, db } from "./firebase-config"
import doraemonGif from './assets/doraemon.gif'
import './App.css'

const cookies = new Cookies();
const colors = [
  "red", "orange", "yellow", "green", "blue", "purple", "pink", "brown", "black"
];

let newUsername = "";

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null)
  const messagesRef = collection(db, "messages");

  const roomInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const ctxRef = useRef(null);

  const strokeWidths = {
    pen: 0.3,
    pencil: 3.0,
    marker: 5.0,
    brush: 7.5,
  };

  const startDrawing = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current = ctx;

    if (tool !== "eraser") {
      ctx.lineWidth = strokeWidths[tool] || 1.0;
      ctx.strokeStyle = color;
    }
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = ctxRef.current;
    if (tool === "eraser") {
      ctx.clearRect(
        e.nativeEvent.offsetX - 10,
        e.nativeEvent.offsetY - 10,
        20,
        20
      ); 
    } else {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const switchToPencil = () => {
    setTool("pencil");
  };

  const switchToEraser = () => {
    setTool("eraser");
  };

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    if(room){
      leaveRoom();
    }
    setRoom(null);
  };

  const changeName = () => {
    newUsername = nameInputRef.current.value;
    cookies.set("username", newUsername);
  }

  const leaveRoom = async (e) => {
    await addDoc(messagesRef, {
      text: cookies.get("username") + " left chat",
      createdAt: serverTimestamp(),
      user: "CHATG0D",
      room: room,
      uid: "IgFDnls934dsyhs3otFHIRe87uV2",
    });
    setRoom(null);
  }

  const joinRoom = async (e) => {
    const roomValue = roomInputRef.current.value;
    setRoom(roomValue);

    console.log("JOINED ROOM");
    await addDoc(messagesRef, {
      text: cookies.get("username") + " joined chat",
      createdAt: serverTimestamp(),
      user: "CHATG0D",
      room: roomValue,
    });
  }

  if(!isAuth){
    return (
      <div>
        <Auth setIsAuth={setIsAuth}/>
      </div>
      );
  }
  return (
  <>
    {room ? (
      <div>
        <Chat room={room} />
        <button onClick={leaveRoom}>leave room ☘︎</button>
        <div className="sign-out">
          <button onClick={signUserOut}>sign out</button>
          <canvas
            ref={canvasRef}
            width={550}
            height={250}
            style={{ border: "1px solid black" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          ></canvas>
          <button onClick={clearCanvas}>Clear</button>
          <div className="tools">
              <button onClick={() => setTool("pen")}>Pen</button>
              <button onClick={() => setTool("pencil")}>Pencil</button>
              <button onClick={() => setTool("marker")}>Marker</button>
              <button onClick={() => setTool("brush")}>Paint Brush</button>
              <button onClick={() => setTool("eraser")}>Eraser</button>
              </div>
            <div className="color-buttons">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      backgroundColor: c,
                      color: c === "yellow" ? "black" : "white", //i hate the color yellow it breaks the continuity :/
                      border: color === c ? "2px solid #333" : "none",
                      marginRight: "5px",
                      padding: "5px 10px",
                      borderRadius: "5px"
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
        </div>
      </div>
    ) : (
      <div className="room">

        <label>
          ᓚ₍⑅^- .-^₎ -ᶻ 𝗓 𐰁✧ <br />
          Enter Room Name:
        </label>
        <input ref={roomInputRef} />
        <button onClick={joinRoom}> ≽^•⩊•^≼ enter chatroom ₍^. .^₎⟆</button>
        <label>
          <br />
          Enter Username:
        </label>
        <input ref={nameInputRef} />
        <button onClick={changeName}> submit name ＊*•̩̩͙✩•̩̩͙*˚</button>
        <div className="sign-out">
          <button onClick={signUserOut}>sign out</button>
        </div>
      </div>
    )}
  </>
);
}

export default App;