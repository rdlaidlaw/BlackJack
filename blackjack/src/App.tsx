import { Routes, Route, Link } from "react-router-dom";
import Game from "./Game";

function Home() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Link to="/game">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl">Play</button>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}
