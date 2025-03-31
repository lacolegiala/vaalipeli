import { useState } from 'react'
import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import GameView from './components/GameView';
import { GameData } from './types';

function App() {
  const [gameData, setGameData] = useState<GameData>();

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home setGameData={setGameData} />} />
        <Route path='/play' element={gameData ? <GameView gameData={gameData} /> : <Home setGameData={setGameData} />} />
      </Routes>
    </Router>
  );
}

export default App
