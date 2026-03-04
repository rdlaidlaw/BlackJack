import { Routes, Route, Link } from "react-router-dom";
import Game from "./Game";

function Home() {
  return (
    <div>
      <Link to="/game">
        <button>Play</button>
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