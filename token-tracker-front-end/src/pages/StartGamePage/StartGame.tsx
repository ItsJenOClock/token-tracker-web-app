import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  fetchTokenPalettes,
  createGame,
  fetchCurrentGame,
  endGame,
} from "../../services/api";
import { TokenPaletteType, GameInstance } from "../../types/types";
import GameInfo from "../../components/GameInfo/GameInfo";
import "../../assets/styles/App.css";

const StartGame = () => {
  const [tokenPalettes, setTokenPalettes] = useState<TokenPaletteType[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<GameInstance | null>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTokenPalettes()
      .then(setTokenPalettes)
      .catch(() => setError("Failed to load token palettes."));

    fetchCurrentGame()
      .then(setActiveGame)
      .catch(() => setActiveGame(null));
  }, []);

  const handleStartGame = async () => {
    if (!selectedPalette) {
      setError("Please select a token palette.");
      return;
    }

    if (activeGame) {
      const confirmEnd = window.confirm(
        "You have a current game. Are you sure you want to end it and start a new game?",
      );

      if (confirmEnd) {
        try {
          await endGame(activeGame.id.toString());
          setActiveGame(null);
          await startNewGame();
        } catch (err) {
          setError("Failed to end the current game.");
        }
      }
    } else {
      await startNewGame();
    }
  };

  const startNewGame = async () => {
    setLoading(true);
    try {
      const newGame = await createGame(selectedPalette);
      navigate(`/game/${newGame.id}`);
    } catch (err) {
      setError("Failed to start a new game.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Start a New Game
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {tokenPalettes.length === 0 ? (
          <p className="italic text-gray-500 text-center">
            No token palettes found.{" "}
            <a href="/token-palettes" className="text-blue-500 underline">
              Create a token palette here.
            </a>
          </p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <select
                value={selectedPalette}
                onChange={(e) => setSelectedPalette(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-700 cursor-pointer"
              >
                <option value="">-- Select a Palette --</option>
                {tokenPalettes.map((palette) => (
                  <option key={palette.id} value={palette.id}>
                    {palette.name}
                  </option>
                ))}
              </select>

              <button
                disabled={loading}
                onClick={handleStartGame}
                className={`px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-hourglass-start"></i> Starting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-hourglass-start"></i> Start Game
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <div>
        <p className="m-4"></p>
      </div>

      {activeGame && (
        <GameInfo
          game={activeGame}
          showResumeButton={true}
        />
      )}

      {showModal && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50"
          aria-labelledby="confirmation-modal"
          aria-hidden={!showModal}
        >
          <div className="relative bg-white w-full max-w-sm mx-auto rounded-lg shadow-md p-4 border border-gray-300 pb-2">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-medium text-gray-900">Success</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 cursor-pointer"
                aria-label="Close"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            </div>

            <div className="py-4 text-center">
              <p className="text-sm text-gray-500">Game successfully created! 🎉</p>
              {activeGame && (
                <p>
                  <a
                    href={`/game/${activeGame.id}`}
                    className="text-blue-500 underline text-sm"
                  >
                    View Game
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartGame;

