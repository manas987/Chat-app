import { Eye, EyeOff, Lock, MessageSquareCheck, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/api";

export function Login() {
  const [login, setlogin] = useState(true);
  const [showpass, setshowpass] = useState(false);
  const [fullname, setfullname] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const handelsubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    seterror("");

    try {
      const response = await fetch(
        login ? API_CONFIG.ENDPOINTS.SIGNIN : API_CONFIG.ENDPOINTS.SIGNUP,
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
        localStorage.setItem("chattoken", data.token);
        nav("/home");
      } else {
        seterror(data.message ?? "Something went wrong");
      }
    } catch {
      seterror("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-8 sm:p-10 animate-rise-in">
      <div className="flex flex-col items-center gap-1.5 mb-7">
        <div className="text-white bg-orange-700 p-3 rounded-2xl ring-1 ring-white/20 shadow-lg shadow-orange-950/50 mb-1.5">
          <MessageSquareCheck size={26} />
        </div>
        <h1 className="text-center text-white text-2xl font-semibold tracking-tight">
          {login ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-white/45 text-center">
          {login
            ? "Sign in to continue to your messages"
            : "Start chatting in a few seconds"}
        </p>
      </div>

      <form onSubmit={handelsubmit} className="flex flex-col gap-3.5">
        {!login && (
          <Field icon={<User size={18} />}>
            <input
              type="text"
              placeholder="Full name"
              value={fullname}
              onChange={(e) => setfullname(e.target.value)}
              required
              className="input-field"
            />
          </Field>
        )}

        <Field icon={<User size={18} />}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
            autoComplete="username"
            className="input-field"
          />
        </Field>

        <Field
          icon={<Lock size={18} />}
          trailing={
            <button
              type="button"
              onClick={() => setshowpass((prev) => !prev)}
              aria-label={showpass ? "Hide password" : "Show password"}
              className="text-white/40 hover:text-white/70 transition-colors">
              {showpass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }>
          <input
            type={showpass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            autoComplete={login ? "current-password" : "new-password"}
            className="input-field"
          />
        </Field>

        <div
          className="text-red-400 text-sm leading-tight transition-all overflow-hidden"
          style={{ maxHeight: error ? "3rem" : "0" }}
          role="alert">
          <p className="pt-0.5">{error}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1.5 p-3 text-white font-medium rounded-2xl bg-orange-700 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-orange-950/40">
          {loading ? (login ? "Signing in…" : "Creating account…") : login ? "Login" : "Create Account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setlogin((prev) => !prev);
          seterror("");
        }}
        className="w-full text-sm text-white/40 hover:text-orange-400 text-center mt-5 transition-colors">
        {login ? "New here? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

function Field({
  icon,
  trailing,
  children,
}: {
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 bg-white/5 rounded-2xl ring-1 ring-white/10 focus-within:ring-white/25 focus-within:bg-white/[0.07] transition">
      <span className="text-white/35 shrink-0">{icon}</span>
      {children}
      {trailing}
    </div>
  );
}
