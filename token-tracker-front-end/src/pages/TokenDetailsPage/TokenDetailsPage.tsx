import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  fetchTokenPalettes,
  addTokenToPalette,
  fetchTokenDetails,
} from "../../services/api";
import { TokenDetails } from "../../types/types";
import "../../assets/styles/App.css";

const TokenDetailsPage = () => {
  const { oracleId, side } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser } = useAuth();
  const [token, setToken] = useState<TokenDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenPalettes, setTokenPalettes] = useState(
    location.state?.tokenPalettes || [],
  );
  const [selectedPalette, setSelectedPalette] = useState("");
  const [confirmation, setConfirmation] = useState<{
    message: string;
    link: string;
    paletteName: string;
  } | null>(null);

  const previousPage = location.state?.from || "/search";

  useEffect(() => {
    const fetchTokenDetailsWrapper = async () => {
      try {
        const data = await fetchTokenDetails(oracleId!, side!);
        setToken(data);

        if (loggedInUser && !tokenPalettes.length) {
          const palettes = await fetchTokenPalettes();
          setTokenPalettes(palettes);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch token details");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenDetailsWrapper();
  }, [oracleId, side, loggedInUser]);

  const handleAddTokenToPalette = async () => {
    if (!selectedPalette) {
      alert("Please select a palette before adding the token.");
      return;
    }

    try {
      await addTokenToPalette(selectedPalette, oracleId!, Number(side));
      const updatedPalettes = await fetchTokenPalettes();
      setTokenPalettes(updatedPalettes);
      const selectedPaletteDetails = tokenPalettes.find(
        (palette) => palette.id === selectedPalette,
      );
      const paletteName = selectedPaletteDetails?.name || "palette";
      setConfirmation({
        message: "Token added to ",
        link: `/token-palettes/${selectedPalette}`,
        paletteName,
      });
      setTimeout(() => {
        setConfirmation(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to add token to palette:", error);
      alert("Failed to add token to the palette. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!token) return <p>Token not found.</p>;

  return (
    <div className="text-center">
      <button onClick={() => navigate(previousPage)} className="back-button">
        ←
      </button>
      <h1>{token.name}</h1>
      {token.imageUri && (
        <img
          src={token.imageUri}
          alt={token.name}
          className="image-max-width"
        />
      )}
      <p>
        <strong>Type:</strong> {token.typeLine || "No type available"}
      </p>

      {token.oracleText?.trim() && (
        <p>
          <strong>Text:</strong> {token.oracleText}
        </p>
      )}

      {token.power?.trim() !== "N/A" &&
        token.toughness?.trim() !== "N/A" &&
        token.power?.trim() &&
        token.toughness?.trim() && (
          <p>
            <strong>Power/Toughness:</strong> {token.power} / {token.toughness}
          </p>
        )}
      <p>
        <strong>Artist:</strong> {token.artist || "Unknown"}
      </p>

      {loggedInUser && (
        <div>
          <h3>Add to Palette</h3>
          <select
            value={selectedPalette}
            onChange={(e) => setSelectedPalette(e.target.value)}
            className="search-toggle-button"
          >
            <option value="">-- Select a Palette --</option>
            {tokenPalettes.map((palette) => (
              <option key={palette.id} value={palette.id}>
                {palette.name}
              </option>
            ))}
          </select>

          {selectedPalette && (
            <button onClick={handleAddTokenToPalette}>Add to Palette</button>
          )}

          {confirmation && (
            <p className="confirmation-message">
              {confirmation.message}
              <Link to={confirmation.link}>{confirmation.paletteName}</Link>!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenDetailsPage;
