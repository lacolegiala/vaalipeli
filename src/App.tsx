import { useEffect, useState } from 'react'
import './App.css'
import React from 'react'
import { Route, Router, Routes } from 'react-router-dom';
import { createBrowserHistory } from "history";
import Home from './components/Home';
import GameView from './components/GameView';
import { GameData } from './types';

const history = createBrowserHistory();

function App() {
  const [gameData, setGameData] = useState<GameData>();

  return (
    <div>
     <Router 
        navigator={history}
        location={history.location}
      >
        <Routes>
          <Route path='/' element={<Home setGameData={setGameData} />} />
          <Route path='/play' element={gameData ? <GameView gameData={gameData} /> : <Home setGameData={setGameData}/>} />
        </Routes>
     </Router>
    </div>
  )
}

export default App
