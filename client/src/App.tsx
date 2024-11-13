import { ChangeEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Message } from "./types/types";

function App() {
  const [message, setMessage] = useState("");
  const [reciever, setReciever] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const socket = io("http://localhost:4000", {
    query: {
      key: "Jyanial",
    },
  });

  useEffect(() => {
    socket.on("messages", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
      socket.off("messages");
    };
  }, [socket]);

  const handleSend = () => {
    socket.emit("send-message", { message, reciever });
    setMessage("");
    setReciever("");
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-[100vw] justify-center p-5">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="enter message"
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            className="w-[40%] border pl-4 rounded-md"
          />

          <input
            type="text"
            placeholder="enter reciever"
            value={reciever}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setReciever(e.target.value)
            }
            className="w-[40%] border pl-4 rounded-md"
          />

          <button
            onClick={handleSend}
            className="bg-black px-4 py-1 rounded-md text-white"
          >
            Send
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-red-950 my-6">Messages</h1>
          {messages.map((msg) => (
            <p key={msg.message}>{msg.message}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
