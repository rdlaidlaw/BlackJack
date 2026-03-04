import './App.css'
import Hand from './Hand'
import Game from './Game'
import { Routes, Route } from 'react-router-dom';

function Home() {
  return (
    <>
      <Hand></Hand>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}
