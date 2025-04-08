import { useEffect, useState } from 'react';
import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import GameView from './components/GameView';
import { Candidate, CandidateWithParty } from './types';

function App() {
  const [candidates, setCandidatesState] = useState<CandidateWithParty[]>([]);

  const setCandidates = (candidates: CandidateWithParty[]) => {
    setCandidatesState(candidates);
    localStorage.setItem("candidates", JSON.stringify(candidates));
  };

  useEffect(() => {
    const stored = localStorage.getItem("candidates");
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
            candidates.length > 0 ? (
              <GameView candidates={candidates} setCandidates={setCandidates} />
            ) : (
              <div className="spinner">🔄 Ladataan peliä...</div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
