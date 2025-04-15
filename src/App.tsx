import { useEffect, useState } from 'react';
import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import GameView from './components/GameView';
import { CandidateWithParty } from './types';

function App() {
  const [candidates, setCandidatesState] = useState<CandidateWithParty[]>([]);

  const setCandidates = (candidates: CandidateWithParty[]) => {
    setCandidatesState(candidates);
    sessionStorage.setItem("candidates", JSON.stringify(candidates));    
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("candidates");
    if (stored) {
      setCandidatesState(JSON.parse(stored));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setCandidates={setCandidates} />} />
        <Route
          path="/play"
          element={
            <GameView candidates={candidates} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
