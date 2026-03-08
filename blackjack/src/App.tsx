import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Game from "./Game";
import Deck from "./Deck";
import { useState } from "react";

interface HomeProps {
  startGame: () => void;
}

function Home({ startGame }: HomeProps) {
  const navigate = useNavigate();

  function handlePlay() {
    startGame();
    navigate("/game");
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <button
        onClick={handlePlay}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl"
      >
        Play
      </button>
    </div>
  );
}

export default function App() {
  const [deck, setDeck] = useState<Deck | null>(null);

  function startGame() {
    setDeck(new Deck());
  }

  return (
    <Routes>
      <Route path="/" element={<Home startGame={startGame}/>} />
      <Route path="/game" element={<Game deck={deck}/>} />
    </Routes>
  );
}
