import { useEffect, useState } from "react";
import { CandidateWithParty, GameData } from "../types";
import React from "react";
import { useNavigate } from "react-router-dom";
import { generateGameData } from "../utils/generateGameData";

type GameViewProps = {
  candidates: CandidateWithParty[];
  setCandidates: (candidates: CandidateWithParty[]) => void;
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
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(
    null
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { round: number; selectedId: number }[]
  >(() => {
    const saved = localStorage.getItem("userAnswers");
    return saved ? JSON.parse(saved) : [];
  });

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
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  }, [userAnswers]);

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
    setUserAnswers((prev) => [...prev, { round, selectedId: id }]);

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

  const getFeedbackMessage = (score: number): string => {
    if (score === 0) return "Tietämättömyytesi on jo vaikuttavaa 🤩";
    if (score <= 2) return "Arvatenkin et vielä tiedä, ketä aiot äänestää? 🙂";
    if (score <= 4)
      return "Muutama oikein, mutta et selvästikään ole politiikan taituri 🤷‍♀️";
    if (score <= 7) return "Olet jo jonkin verran jyvällä 😜";
    if (score <= 9) return "Sivistynyt, keskivertoihmistä parempi 😎";
    return "Onnittelut, olet ✨vaalipelimestari✨ valitettavasti emme jaa palkintoja 😘";
  };

  const clearGameState = () => {
    localStorage.removeItem("round");
    localStorage.removeItem("score");
    localStorage.removeItem("gameData");
    localStorage.removeItem("userAnswers");
  };

  const handleNewGame = () => {
    clearGameState();
    setUserAnswers([])
    setGameData(null);
    setRound(1);
    setScore(0);
    setGame(game + 1);
  };

  const handleBackToMainMenu = () => {
    localStorage.removeItem("candidates");
    clearGameState();
    setUserAnswers([])
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
          <div className="upper-info">
            <h2 className="title">Kierros {round} / 10</h2>
            <div
              className={`score ${
                isFeedbackVisible ? (isCorrect ? "correct" : "incorrect") : ""
              }`}
            >
              Pisteet: {score}
            </div>
            <h3>Kumman ehdokkaan lupaus? 🤔</h3>
          </div>
          <p className="subtitle promise">
            {promise.length <= 90 ? (
              promise ? (
                `”${promise}”`
              ) : (
                "Ei vaalilupausta 🥲"
              )
            ) : (
              <>
                {showMore ? `”${promise}”` : `”${promise.slice(0, 90)}` + "..."}
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
                <h3 className="candidate-name">
                  {candidate.first_name} {candidate.last_name},{" "}
                  {candidate.party_name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="title">Peli ohi!</h2>
          <div className="feedback-box">
            <h2 className="feedback-text">Pisteet: {score} / 10</h2>
            <p className="feedback-text">{getFeedbackMessage(score)}</p>
          </div>
          <div className="button-group">
            <button className="again-button" onClick={handleNewGame}>
              Uudestaan!
            </button>
            <button
              className="button back-button"
              onClick={handleBackToMainMenu}
            >
              Takaisin päävalikkoon
            </button>
          </div>
          <h3 className="subtitle">Oikeat vastaukset:</h3>
          <div className="results-list">
            {gameData.rounds.map((roundItem, index) => {
              const userAnswer = userAnswers.find((a) => a.round === index + 1);
              const isUserCorrect =
                userAnswer?.selectedId === roundItem.correctCandidateId;

              return (
                <div
                  key={index}
                  className={`result-item ${
                    isUserCorrect ? "result-correct" : "result-incorrect"
                  }`}
                >
                  <p className="promise">”{roundItem.promise}”</p>
                  <div className="candidate-cards result-cards">
                    {roundItem.candidates.map((candidate) => {
                      const isCorrect =
                        candidate.id === roundItem.correctCandidateId;

                      return (
                        <div
                          key={candidate.id}
                          className={`candidate-button small-card ${
                            isCorrect ? "correct" : ""
                          }`}
                        >
                          <img
                            className="candidate-image"
                            src={`https://vaalikone.yle.fi/${candidate.image}`}
                            alt={`${candidate.first_name} ${candidate.last_name}`}
                          />
                          <h3 className="candidate-name">
                            {candidate.first_name} {candidate.last_name},{" "}
                            {candidate.party_name}
                          </h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;
