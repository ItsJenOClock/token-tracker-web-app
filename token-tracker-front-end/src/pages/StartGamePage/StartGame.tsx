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
    <div>
      <h1>Start a New Game</h1>
      {error && <p className="error-message">{error}</p>}
      {tokenPalettes.length === 0 ? (
        <p>
          No token palettes found.{" "}
          <a href="/token-palettes" className="link">
            Create a token palette here.
          </a>
        </p>
      ) : (
        <div>
          <label htmlFor="token-palette-dropdown">
            Select a Token Palette:&nbsp;
          </label>
          <select
            id="token-palette-dropdown"
            value={selectedPalette}
            onChange={(e) => setSelectedPalette(e.target.value)}
          >
            <option value="">-- Select a Palette --</option>
            {tokenPalettes.map((palette) => (
              <option key={palette.id} value={palette.id}>
                {palette.name}
              </option>
            ))}
          </select>

          <button onClick={handleStartGame} disabled={loading}>
            {loading ? "Starting..." : "Start Game"}
          </button>
        </div>
      )}

      {activeGame && (
        <div>
          <h2>Active Game</h2>
          <GameInfo game={activeGame} showResumeButton={true} />
        </div>
      )}
    </div>
  );
};

export default StartGame;
