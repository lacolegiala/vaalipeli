import { useEffect, useState } from "react";
import { GameData } from "../types";
import React from "react";
import { useNavigate } from 'react-router-dom';

type GameViewProps = {
  gameData: GameData;
};

const GameView: React.FC<GameViewProps> = ({ gameData }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => console.log(round, gameData), [round]);

  const handlePickChoice = (id: number) => {
    if (id === gameData.rounds[round - 1].correctCandidateId) {
      setScore(score + 1);
    }
    setRound(round + 1);
  };

  return (
    <div>
      {round < 11 ? (
        <div>
          {round} / 10
          <div>Pisteet: {score}</div>
          <div>{gameData.rounds[round - 1].promise}</div>
          <div>
            <button onClick={() => handlePickChoice(gameData.rounds[round - 1].candidates[0].id)}>
              {gameData.rounds[round - 1].candidates[0].first_name} {gameData.rounds[round - 1].candidates[0].last_name}
            </button>
          </div>
          <div>
            <button onClick={() => handlePickChoice(gameData.rounds[round - 1].candidates[1].id)}>
              {gameData.rounds[round - 1].candidates[1].first_name} {gameData.rounds[round - 1].candidates[1].last_name}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div>Peli ohi! Pisteet: {score}</div>
          <button onClick={() => navigate('/')}>Takaisin päävalikkoon</button>
        </div>
      )}
    </div>
  );
};

export default GameView;
