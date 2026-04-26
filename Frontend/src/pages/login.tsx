import { Eye, EyeOff, Lock, MessageSquareCheck, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [login, setlogin] = useState(true);
  const [showpass, setshowpass] = useState(false);
  const [fullname, setfullname] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");

  const nav = useNavigate();

  const handelsubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(
      login ? "http://localhost:3100/signin" : "http://localhost:3100/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          login ? { username, password } : { fullname, username, password },
        ),
      },
    );
    const data = await response.json();
    if (data.token) {
      nav("/home");
      localStorage.setItem("chattoken", data.token);
    } else {
      seterror(data);
    }
    console.log(data);
  };

  return (
    <>
      <div
        className={`glass-card h-lv w-lg p-10 ${login ? "pt-18" : "pt-14"} transition-all duration-300`}>
        <div className="flex flex-col gap-4">
          <div className=" flex flex-col items-center gap-1">
            <div className="text-center text-white text-2xl mb-1 bg-white/20 p-2 rounded-2xl opacity-50 ring-1 ring-white/30 ">
              <MessageSquareCheck size={30} />
            </div>
            <div className="text-center text-white text-2xl font-extrabold tracking-tight">
              {login ? "Welcome back" : "Create Account"}
            </div>
            <div className="text-sm text-white/40 font text-center ">
              {login ? (
                <div>Sign in to continue to your messages </div>
              ) : (
                <div>Start your account in a few seconds</div>
              )}
            </div>
          </div>
          <form onSubmit={handelsubmit} className="flex flex-col gap-4">
            {!login && (
              <div className="relative">
                <User
                  size={19}
                  className="text-white/30 absolute bottom-3.5 left-3"
                />
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullname}
                  onChange={(e) => setfullname(e.target.value)}
                  className="text-white/80 p-3 pl-10 w-full outline-none bg-white/5 rounded-2xl focus:bg-white/10 ring-1 ring-white/10 focus:ring-white/20 transition overflow-scroll"
                />
              </div>
            )}
            <div className="relative">
              <User
                size={19}
                className={`text-white/30 absolute ${error && !login ? "bottom-7.5" : "bottom-3.5"} left-3`}
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setusername(e.target.value);
                  if (error) {
                    seterror("");
                  }
                }}
                className="text-white/80 p-3 pl-10 w-full outline-none bg-white/5 rounded-2xl focus:bg-white/10 ring-1 ring-white/10 focus:ring-white/20 transition overflow-scroll"
              />
              {error && !login && (
                <div className="p-1 text-red-400 text-sm -mb-3 leading-tight tracking-tight">
                  {error}
                </div>
              )}
            </div>
            <div className="relative">
              <Lock
                size={19}
                className={`text-white/30 absolute ${error && login ? "bottom-6" : "bottom-3.5"} left-3`}
              />
              <input
                type={showpass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="text-white/80 p-3 pl-10 pr-12 w-full outline-none bg-white/5 rounded-2xl ring-1 ring-white/10 focus:ring-white/20 focus:bg-white/10 transition overflow-scroll"
              />
              {showpass ? (
                <Eye
                  className={`text-white/40 absolute ${error && login ? "bottom-6" : "bottom-3.5"} right-3 hover:cursor-pointer `}
                  onClick={() => setshowpass((prev) => !prev)}
                />
              ) : (
                <EyeOff
                  className={`text-white/40 absolute ${error && login ? "bottom-6" : "bottom-3.5"} right-3 hover:cursor-pointer `}
                  onClick={() => setshowpass((prev) => !prev)}
                />
              )}
              {error && login && (
                <div className="p-1 text-red-400 text-sm -mb-3 leading-tight tracking-tight">
                  {error}
                </div>
              )}
            </div>
            <button className="p-2.5 mt-3 text-white outline-none rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:brightness-110 hover:scale-[0.98] transition">
              {login ? <div>Login</div> : <div>Create Account</div>}
            </button>
          </form>
          <div
            onClick={() => {
              setlogin((prev) => !prev);
              if (error) {
                seterror("");
              }
            }}
            className="text-sm text-white/40 hover:text-blue-400 text-center -mt-1">
            {login ? (
              <div>New user? Sign up</div>
            ) : (
              <div>Alredy have an account? Login</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
