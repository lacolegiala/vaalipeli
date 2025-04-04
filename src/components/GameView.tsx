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
  const [game, setGame] = useState(1);
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
    setGameData(null);
    setRound(1);
    setScore(0);
    setGame(game + 1);
  };

  const handleBackToMainMenu = () => {
    setGameData(null);
    setRound(1);
    setScore(0);
    setCandidates([]);
    navigate("/");
  };

  if (!gameData) return <div className="spinner">Ladataan peliä...</div>;

  return (
    <div className="container">
      {round <= 10 ? (
        <div>
          <h2 className="title">Kierros {round} / 10</h2>
          <div className="score">Pisteet: {score}</div>
          <p className="subtitle">{gameData.rounds[round - 1].promise}</p>

          <div className="button-group">
            {gameData.rounds[round - 1].candidates.map((candidate) => (
              <button key={candidate.id} className="button candidate-button" onClick={() => handlePickChoice(candidate.id)}>
                <img className="candidate-image" src={`https://vaalikone.yle.fi/${candidate.image}`} alt={`${candidate.first_name} ${candidate.last_name}`} />
                <h3 className="candidate-name">{candidate.first_name} {candidate.last_name}</h3>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="title">Peli ohi!</h2>
          <p className="subtitle">Lopullinen pistemäärä: {score}</p>
          <div className="button-group">
            <button className="again-button" onClick={handleNewGame}>Uudestaan!</button>
            <button className="button back-button" onClick={handleBackToMainMenu}>Takaisin päävalikkoon</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;
