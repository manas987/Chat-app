import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Homepage } from "./pages/homepage";
import { Profile } from "./pages/profile";

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030308] flex items-center justify-center p-4">
      <div
        className="pointer-events-none absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-orange-600/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-32 h-[36rem] w-[36rem] rounded-full bg-amber-500/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
