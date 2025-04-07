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
  const [round, setRound] = useState(() => {
    const saved = localStorage.getItem("round");
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("score");
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [game, setGame] = useState(() => {
    const saved = localStorage.getItem("game");
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [gameData, setGameData] = useState<GameData | null>(() => {
    const saved = localStorage.getItem("gameData");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [showMore, setShowMore] = useState<boolean>(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("round", round.toString());
  }, [round]);
  
  useEffect(() => {
    localStorage.setItem("score", score.toString());
  }, [score]);
  
  useEffect(() => {
    if (gameData) {
      localStorage.setItem("gameData", JSON.stringify(gameData));
    }
  }, [gameData]);
  
  useEffect(() => {
    if (!gameData && candidates.length > 0) {
      const generated = generateGameData(candidates);
      setGameData(generated);
    }
  }, [candidates, game, gameData]);

  const roundData = gameData?.rounds[round - 1];
  const promise = roundData?.promise ?? "";

  const handlePickChoice = (id: number) => {
    if (!gameData) return;
  
    const correct = id === gameData.rounds[round - 1].correctCandidateId;
    setSelectedCandidateId(id);
    setIsCorrect(correct);
    setIsFeedbackVisible(true);
  
    if (correct) {
      setScore((prev) => prev + 1);
    }
  
    setTimeout(() => {
      setShowMore(false);
      setRound((prev) => prev + 1);
      setSelectedCandidateId(null);
      setIsCorrect(null);
      setIsFeedbackVisible(false);
    }, 1000);
  };
  

  const clearGameState = () => {
    localStorage.removeItem("round");
    localStorage.removeItem("score");
    localStorage.removeItem("gameData");
    localStorage.removeItem("candidates");
  };
  
  const handleNewGame = () => {
    clearGameState();
    setGameData(null);
    setRound(1);
    setScore(0);
    setGame(game + 1);
  };
  
  const handleBackToMainMenu = () => {
    clearGameState();
    setGameData(null);
    setRound(1);
    setScore(0);
    setCandidates([]);
    navigate("/");
  };

  if (!gameData) return <div className="spinner">Ladataan peliä...</div>;

  return (
    <div>
      {round <= 10 ? (
        <div className="container">
          <h2 className="title">Kierros {round} / 10</h2>
          <div className={`score ${isFeedbackVisible ? (isCorrect ? "correct" : "incorrect") : ""}`}>
            Pisteet: {score}
          </div>
          <p className="subtitle promise">
            {promise.length <= 150 ? (
              promise
            ) : (
              <>
                {showMore ? promise : promise.slice(0, 150) + '...'}
                {!showMore && (
                  <button
                    className="showMore"
                    onClick={() => setShowMore(true)}
                  >
                    Näytä koko lupaus
                  </button>
                )}
              </>
            )}
          </p>
          <div className="candidate-cards">
            {gameData.rounds[round - 1].candidates.map((candidate) => (
              <button
                key={candidate.id}
                className={`button candidate-button ${
                  isFeedbackVisible && candidate.id === selectedCandidateId
                    ? isCorrect
                      ? "correct"
                      : "incorrect"
                    : ""
                }`}
                onClick={() => handlePickChoice(candidate.id)}
                disabled={isFeedbackVisible}
              >
                <img
                  className="candidate-image"
                  src={`https://vaalikone.yle.fi/${candidate.image}`}
                  alt={`${candidate.first_name} ${candidate.last_name}`}
                />
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
