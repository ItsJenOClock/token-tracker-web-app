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
    <div className="bg-gray-100 p-4 rounded shadow-md max-w-sm mx-auto">
      <p className="text-gray-800 text-sm sm:text-base space-y-2">
        <span className="block">
          Selected Palette: <strong className="font-bold">{game.tokenPalette.name}</strong>
        </span>
        <span className="block">
          Started: <strong className="font-bold">{new Date(game.createdAt).toLocaleString()}</strong>
        </span>
      </p>
      <p className="flex justify-center items-center">
        {showResumeButton && (
          <button
            onClick={() => navigate(`/game/${game.id}`)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 cursor-pointer"
          >
            Resume Game
          </button>
        )}
      </p>
    </div>
  );
};

export default GameInfo;
