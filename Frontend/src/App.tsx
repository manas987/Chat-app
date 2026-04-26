import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login";
import { Homepage } from "./pages/homepage";
import { Profile } from "./pages/profile";

function App() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-black to-blue-900 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
