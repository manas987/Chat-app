import { ArrowLeft, Search, Send, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Messageg } from "../components/msg";
import { Chats } from "../components/chat";
import { API_CONFIG } from "../config/api";

export function Homepage() {
  const navigate = useNavigate();

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

    const ws = new WebSocket(API_CONFIG.WS_URL);
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
      const res = await fetch(`${API_CONFIG.ENDPOINTS.USERS_SEARCH}?search=${search}`, {
        headers: { token: token ?? "" },
      });
      const data = await res.json();
      setResults(data.filter((u: any) => u.username !== meUsername));
    };
    searchres();
  }, [search, meUsername]);

  function sendMessage(text: string) {
    if (!ws || !text.trim()) return;

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
    <div className="glass-card flex w-full max-w-5xl h-[85vh] animate-rise-in overflow-hidden">
      <div
        className={`${selectedUser ? "hidden sm:flex" : "flex"} flex-col gap-3 bg-white/[0.03] w-full sm:w-[38%] lg:w-[32%] text-white p-5 border-r border-white/8`}>
        <div>
          <div className="text-white/30 tracking-[0.2em] text-[11px] font-medium">
            INBOX
          </div>
          <h1 className="text-2xl font-semibold text-white">Messages</h1>
        </div>

        <div className="relative">
          <Search
            className="absolute top-1/2 -translate-y-1/2 left-3.5 text-white/35 pointer-events-none"
            size={16}
          />
          <input
            type="text"
            placeholder="Search people…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-10 pr-3.5 bg-white/5 ring-1 ring-white/10 focus:ring-white/25 focus:bg-white/[0.07] rounded-2xl text-white/80 outline-none transition placeholder:text-white/35"
          />
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 -mx-1 px-1">
          {results.length === 0 ? (
            <p className="text-white/30 text-sm text-center mt-8 px-4">
              {search
                ? "No one matches that search."
                : "Search for someone to start a conversation."}
            </p>
          ) : (
            results.map((user) => (
              <Chats
                key={user.username}
                username={user.username}
                fullname={user.fullname}
                selected={user.username === selectedUser}
                onClick={() => {
                  setSelectedUser(user.username);
                  setSelectedName(user.fullname);
                }}
              />
            ))
          )}
        </div>
      </div>

      {selectedUser ? (
        <div className="flex flex-col flex-1 p-6 pt-5 min-w-0">
          <div className="flex items-center text-white shrink-0">
            <button
              type="button"
              onClick={() => setSelectedUser("")}
              aria-label="Back to conversations"
              className="sm:hidden -ml-1.5 mr-2 p-1.5 rounded-full hover:bg-white/8 transition text-white/70">
              <ArrowLeft size={20} />
            </button>
            <div className="bg-orange-700 rounded-full p-2 mr-3 ring-1 ring-white/20">
              <User className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <div className="font-medium truncate">{selectedName}</div>
              <div className="text-xs text-white/45 truncate">
                @{selectedUser}
              </div>
            </div>
          </div>

          <div className="border-b border-white/8 -mr-6 -ml-6 mt-4 mb-2" />

          <div className="flex-1 overflow-y-auto px-1 py-2 flex flex-col gap-2">
            {filteredMessages.length === 0 ? (
              <p className="text-white/30 text-sm text-center m-auto">
                No messages yet — say hi to {selectedName.split(" ")[0]}.
              </p>
            ) : (
              filteredMessages.map((msg, i) => (
                <Messageg
                  key={msg._id ?? i}
                  content={msg.textContent}
                  time={new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  sentbyme={msg.sentBy === meUsername}
                />
              ))
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(text);
              setText("");
            }}
            className="flex items-center gap-2 bg-white/5 ring-1 ring-white/10 focus-within:ring-white/25 rounded-2xl px-4 py-1 mt-2 transition shrink-0">
            <input
              type="text"
              placeholder="Write a message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="placeholder:text-white/35 flex-1 outline-none text-white/90 py-2.5 bg-transparent min-w-0"
            />

            <button
              type="submit"
              disabled={!text.trim()}
              aria-label="Send message"
              className="bg-orange-700 p-2 text-white rounded-xl hover:brightness-110 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none shrink-0">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden sm:flex flex-col flex-1 items-center justify-center text-center px-6">
          <div className="bg-white/8 p-5 rounded-full ring-1 ring-white/15 mb-4">
            <Send size={32} className="text-white/60" />
          </div>
          <h2 className="text-white text-lg font-semibold mb-1">
            Your messages
          </h2>
          <p className="text-white/45 text-sm max-w-xs">
            Select a chat from the left to begin messaging.
          </p>
        </div>
      )}
    </div>
  );
}
