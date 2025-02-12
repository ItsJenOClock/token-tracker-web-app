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
    <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg border border-gray-300 mx-auto">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Active Game
      </h2>

      <div className="text-gray-700 text-base space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Selected Palette:</span>
          <strong className="text-gray-900">{game.tokenPalette.name}</strong>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Started:</span>
          <strong className="text-gray-900">{new Date(game.createdAt).toLocaleString()}</strong>
        </div>
      </div>

      {showResumeButton && (
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => navigate(`/game/${game.id}`)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md focus:outline-none focus:ring focus:ring-blue-400 cursor-pointer"
          >
            <i class="fa-solid fa-play"></i> Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default GameInfo;