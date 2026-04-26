import { Paperclip, Search, Send, Smile, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Messageg } from "../components/msg";
import { Chats } from "../components/chat";

export function Homepage() {
  const navigate = useNavigate();

  const [meName, setMeName] = useState("");
  const [meUsername, setMeUsername] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const token = localStorage.getItem("chattoken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const ws = new WebSocket("ws://localhost:3100");
    setWs(ws);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "auth",
          token,
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setMeUsername(data.username);
        setMeName(data.fullname);
        setMessages(data.messages);
      }

      if (data.type === "message")
        setMessages((prev) => [...prev, data.message]);
    };

    ws.onclose = () => {
      localStorage.removeItem("chattoken");
      navigate("/login");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const searchres = async () => {
      const res = await fetch(`http://localhost:3100/users?search=${search}`);
      const data = await res.json();
      setResults(data.filter((u: any) => u.username !== meUsername));
    };
    searchres();
  }, [search, meUsername]);

  function sendMessage(text: string) {
    if (!ws || !text) return;

    ws.send(
      JSON.stringify({
        type: "message",
        otherguy: selectedUser,
        text,
      }),
    );
  }

  const filteredMessages = messages.filter(
    (m) =>
      (m.sentBy === meUsername && m.sentTo === selectedUser) ||
      (m.sentBy === selectedUser && m.sentTo === meUsername),
  );

  return (
    <>
      <div className="glass-card flex w-[80%] h-[80vh] rounded-[30px]!">
        <div className="flex flex-col gap-2 bg-white/5 w-[35%] text-white p-5.5">
          <div className="text-white/30 tracking-[0.25em] text-xs">INBOX</div>
          <h1 className="text-3xl font-semibold text-white">Messages</h1>

          <div className="relative mt-3">
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3.5 pl-10 bg-white/2 ring ring-white/10 rounded-2xl text-white/60 outline-none"
            />
            <Search
              className="absolute bottom-4.5 left-3 text-white/50"
              size={18}
            />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {results.map((user) => (
              <div
                key={user.username}
                onClick={() => {
                  setSelectedUser(user.username);
                  setSelectedName(user.fullname);
                }}>
                <Chats username={user.username} fullname={user.fullname} />
              </div>
            ))}
          </div>
        </div>

        {selectedUser ? (
          <div className="flex flex-col flex-1 p-6 pt-5">
            <div className="flex text-white">
              <User
                className="bg-gray-800 rounded-full p-2 mr-2.5 text-white/60 ring ring-white/20"
                size={37}
              />
              <div>
                <div className="font-semibold">{selectedName}</div>
                <div className="text-xs text-white/60 tracking-tight">
                  {selectedUser}
                </div>
              </div>
            </div>

            <div className="border-b border-white/10 -mr-6 -ml-6 p-1.5" />

            <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2">
              {filteredMessages.map((msg, i) => (
                <Messageg
                  key={i}
                  content={msg.textContent}
                  time={new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  sentbyme={msg.sentBy === meUsername}
                />
              ))}
            </div>

            <div className="flex items-center bg-white/10 rounded-2xl p-2 mt-2">
              <Paperclip className="p-2 mr-1.5 text-white/70" size={37} />
              <Smile className="p-2 mr-4.5 text-white/70" size={37} />

              <input
                type="text"
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(text);
                    setText("");
                  }
                }}
                className="placeholder:text-white/40 flex-1 outline-none text-white/90"
              />

              <Send
                onClick={() => {
                  sendMessage(text);
                  setText("");
                }}
                className="bg-linear-150 from-blue-500 via-blue-600 to-purple-700 p-2 text-white/90 rounded-lg hover:brightness-110 transition"
                size={36}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center text-center px-6">
            <div className="bg-white/10 p-6 rounded-full ring ring-white/20 mb-4">
              <Send size={40} className="text-white/70" />
            </div>

            <h2 className="text-white text-xl font-semibold mb-1">
              Your messages
            </h2>

            <p className="text-white/50 text-sm max-w-xs">
              Select a chat from the left to begin messaging.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
