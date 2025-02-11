import React from "react";
import { useNavigate } from "react-router";
import { GameInstance } from "../../types/types";

interface GameInfoProps {
  game: GameInstance;
  showResumeButton?: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({
                                             game,
                                             showResumeButton = true,
                                           }) => {
  const navigate = useNavigate();

  return (
    <div>
      <p>
        <br />
        Selected Palette: <strong>{game.tokenPalette.name}</strong>
        <br />
        Started: <strong>{new Date(game.createdAt).toLocaleString()}</strong>
      </p>
      {showResumeButton && (
        <button onClick={() => navigate(`/game/${game.id}`)}>
          Resume Game
        </button>
      )}
    </div>
  );
};

export default GameInfo;
