import { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:4000");

export const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage,...messages]);
    setMessage("");
  };

  const handleChange = ({ target }) => {
    setMessage(target.value);
  };

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([message,...messages]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <>
    <div className="h-screen dark:bg-gray-800 bg-zinc-200  text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className='bg-gray-900 p-10'>
        <div className="mb-4">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Ingrese su mensaje..."
            name="message"
            value={message}
            required
            className="mt-1 px-3 py-2 border text-black shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            />
        </div>
      <ul className="h-80 overflow-y-auto">
      {
        messages.map((message, index) =>(
            <li key={index} className={`my-2 p-2 text-sm rounded-md table ${message.from === 'Me' ? "bg-green-400 ml-auto text-black" : "bg-sky-300 text-black"}`}>
            <p>{message.from} : {message.body}</p>
            </li>
        ))
      }
      </ul>
      </form>
      </div>
    </>
  );
};
