import { useEffect, useState } from "react";
import { GameData } from "./types";
import React from "react";

type GameViewProps = {
  gameData: GameData
}

const GameView: React.FC<GameViewProps> = (props: GameViewProps) => {
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)

  useEffect(() => console.log(round, props.gameData), [round])

  const handlePickChoice = (id: number) => {
    if (id === props.gameData.rounds[round - 1].correctCandidateId) {
      setScore(score + 1)
    }
    setRound(round + 1)
  }

  return (
    <div>
      {round < 11 && 
        <div>
          {round} / 10
          <div>Pisteet: {score}</div>
          <div>
            {props.gameData.rounds[round - 1].promise}
          </div>
          <div>
            <button onClick={() => handlePickChoice(props.gameData.rounds[round - 1].candidates[0].id)}>{props.gameData.rounds[round - 1].candidates[0].first_name} {props.gameData.rounds[round - 1].candidates[0].last_name}</button>
          </div>
          <div>
            <button onClick={() => handlePickChoice(props.gameData.rounds[round - 1].candidates[1].id)}>{props.gameData.rounds[round - 1].candidates[1].first_name} {props.gameData.rounds[round - 1].candidates[1].last_name}</button>
          </div>
        </div>
      }
      {round > 10 &&
        <div>Game over! Score: {score}</div>
      }
    </div>
  )
}

export default GameView