import { useEffect, useState } from "react";
import { GameData } from "./types";
import React from "react";

type GameViewProps = {
  gameData: GameData
}

const GameView: React.FC<GameViewProps> = (props: GameViewProps) => {
  const [round, setRound] = useState(1)

  useEffect(() => console.log(round, props.gameData), [round])

  return (
    <div>
      {round < 11 && 
        <div>
          {round}
          <div>
            {props.gameData.rounds[round - 1].promise}
          </div>
          <div>
            <button onClick={() => setRound(round + 1)}>{props.gameData.rounds[round - 1].candidates[0].first_name} {props.gameData.rounds[round - 1].candidates[0].last_name}</button>
          </div>
          <div>
            <button onClick={() => setRound(round + 1)}>{props.gameData.rounds[round - 1].candidates[1].first_name} {props.gameData.rounds[round - 1].candidates[1].last_name}</button>
          </div>
        </div>
      }
      {round > 10 &&
        <div>Game over</div>
      }
    </div>
  )
}

export default GameView