import { useState, useEffect } from "react";
import { fetchTokenPalettes, createTokenPalette } from "../../services/api";
import { TokenPaletteType } from "../../types/types";
import { useNavigate } from "react-router";
import "../../assets/styles/App.css";

const TokenPalettePage = () => {
  const [palettes, setPalettes] = useState<TokenPaletteType[]>([]);
  const [paletteName, setPaletteName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTokenPalettes().then(setPalettes);
  }, []);

  const handleCreatePalette = async () => {
    if (!paletteName.trim()) return;
    try {
      const newPalette = await createTokenPalette(paletteName);
      setPalettes([...palettes, newPalette]);
      setPaletteName("");
      setFeedbackMessage(`Token palette "${newPalette.name}" created!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (error) {
      console.error("Failed to create palette:", error);
      alert("Failed to create palette.");
    }
  };

  const handlePaletteClick = (id: string) => {
    navigate(`/token-palettes/${id}`);
  };

  return (
    <div className="token-palettes-container">
      <h1>Token Palettes</h1>

      <h2>Create a New Palette</h2>
      <input
        type="text"
        value={paletteName}
        onChange={(e) => setPaletteName(e.target.value)}
        placeholder="Enter palette name"
      />
      <button onClick={handleCreatePalette} className="create-button">
        Create
      </button>

      {feedbackMessage && (
        <p className="feedback-message">{feedbackMessage}</p>
      )}

      <h2>Existing Palettes</h2>
      <ul>
        {palettes.map((palette) => (
          <li key={palette.id}>
            <button onClick={() => handlePaletteClick(palette.id)}>
              {palette.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenPalettePage;
