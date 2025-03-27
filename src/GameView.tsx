import { useState } from "react";
import { GameData } from "./types";
import React from "react";

type GameViewProps = {
  gameData: GameData
}

const GameView: React.FC<GameViewProps> = (props: GameViewProps) => {
  const [round, setRound] = useState(0)
  return (
    <div>
      {round}
      {props.gameData.rounds[0].promise}
      <button>{props.gameData.rounds[0].candidates[0].first_name} {props.gameData.rounds[0].candidates[0].last_name}</button>
      <button>{props.gameData.rounds[0].candidates[1].first_name} {props.gameData.rounds[0].candidates[1].last_name}</button>
    </div>
  )
}

export default GameView