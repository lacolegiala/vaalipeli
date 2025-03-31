import { useEffect, useState } from "react";
import { Candidate, GameData } from "../types";
import React from "react";
import { useNavigate } from "react-router-dom";
import { generateGameData } from "../utils/generateGameData";

type GameViewProps = {
  candidates: Candidate[];
};

const GameView: React.FC<GameViewProps> = ({ candidates }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [game, setGame] = useState(1)
  const [gameData, setGameData] = useState<GameData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    setRound(1)
    setScore(0)
    setGame(game + 1)
  }

  const handleBackToMainMenu = () => {
    setRound(1)
    setScore(0)
    navigate('/')
  }

  if (!gameData) return <div>Ladataan peliä...</div>;

  return (
    <div>
      {round <= 10 ? (
        <div>
          {round} / 10
          <div>Pisteet: {score}</div>
          <div>{gameData.rounds[round - 1].promise}</div>
          <div>
            <img src={`https://vaalikone.yle.fi/${gameData.rounds[round-1].candidates[0].image}`} />
            <button onClick={() => handlePickChoice(gameData.rounds[round - 1].candidates[0].id)}>
              {gameData.rounds[round - 1].candidates[0].first_name} {gameData.rounds[round - 1].candidates[0].last_name}
            </button>
          </div>
          <div>
            <img src={`https://vaalikone.yle.fi/${gameData.rounds[round-1].candidates[1].image}`} />
            <button onClick={() => handlePickChoice(gameData.rounds[round - 1].candidates[1].id)}>
              {gameData.rounds[round - 1].candidates[1].first_name} {gameData.rounds[round - 1].candidates[1].last_name}
            </button>
          </div>
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
