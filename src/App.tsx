import { useState } from 'react';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import GameView from './components/GameView';
import { Candidate } from './types';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setCandidates={setCandidates} />} />
        <Route path="/play" element={candidates.length > 0 ? <GameView candidates={candidates} /> : <Home setCandidates={setCandidates} />} />
      </Routes>
    </Router>
  );
}

export default App;
