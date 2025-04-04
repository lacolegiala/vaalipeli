import { useEffect, useState } from "react";
import { Candidate, GameData } from "../types";
import React from "react";
import { useNavigate } from "react-router-dom";
import { generateGameData } from "../utils/generateGameData";

type GameViewProps = {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
};

const GameView: React.FC<GameViewProps> = ({ candidates, setCandidates }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [game, setGame] = useState(1)
  const [gameData, setGameData] = useState<GameData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(candidates)
    setGameData(generateGameData(candidates));
  }, [candidates, game]);

  const handlePickChoice = (id: number) => {
    if (!gameData) return;
    
    if (id === gameData.rounds[round - 1].correctCandidateId) {
      setScore(score + 1);
    }
    setRound(round + 1);
  };

  const handleNewGame = () => {
    setGameData(null)
    setRound(1)
    setScore(0)
    setGame(game + 1)
  }

  const handleBackToMainMenu = () => {
    setGameData(null)
    setRound(1)
    setScore(0)
    setCandidates([])
    navigate('/')
  }

  if (!gameData) return <div className="spinner">Ladataan peliä...</div>;

  return (
    <div>
      {round <= 10 ? (
        <div>
          {round} / 10
          <div>Pisteet: {score}</div>
          <div>{gameData.rounds[round - 1].promise}</div>
            <button onClick={() => handlePickChoice(gameData.rounds[round - 1].candidates[0].id)}>
              <img src={`https://vaalikone.yle.fi/${gameData.rounds[round-1].candidates[0].image}`} />
              <h2>{gameData.rounds[round - 1].candidates[0].first_name} {gameData.rounds[round - 1].candidates[0].last_name}</h2>
            </button>
          <button onClick={() => handlePickChoice(gameData.rounds[round - 1].candidates[1].id)}>
            <img src={`https://vaalikone.yle.fi/${gameData.rounds[round-1].candidates[1].image}`} />
            <h2>{gameData.rounds[round - 1].candidates[1].first_name} {gameData.rounds[round - 1].candidates[1].last_name}</h2>
          </button>
        </div>
      ) : (
        <div>
          <div>Peli ohi! Pisteet: {score}</div>
          <button onClick={() => handleNewGame()}>Uudestaan!</button>
          <button onClick={() => handleBackToMainMenu()}>Takaisin päävalikkoon</button>
        </div>
      )}
    </div>
  );
};

export default GameView;
