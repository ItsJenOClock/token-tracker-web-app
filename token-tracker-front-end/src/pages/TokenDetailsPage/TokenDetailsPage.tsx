import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  fetchTokenDetails,
  fetchTokenPalettes,
  addTokenToPalette,
} from "../../services/api";
import AddTokenToPalette from "../../components/AddTokenToPalette/AddTokenToPalette";
import { TokenDetails } from "../../types/types";

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

  const handleTokenAddition = async () => {
    if (!selectedPalette) {
      alert("Please select a palette before adding the token.");
      return;
    }

    try {
      await addTokenToPalette(selectedPalette, oracleId!, Number(side));
      const updatedPalettes = await fetchTokenPalettes();
      setTokenPalettes(updatedPalettes);
    } catch (error) {
      console.error("Error adding token to palette:", error);
      alert("Failed to add token to the palette. Please try again.");
    }
  };

  if (loading)
    return (
      <p className="flex items-center justify-center text-gray-500 italic mb-4">
        <i className="fa-solid fa-spinner fa-spin"></i>
      </p>
    );

  if (error)
    return (
      <p className="flex items-center justify-center text-red-500 text-center mb-4">
        {error}
      </p>
    );

  if (!token)
    return (
      <p className="flex items-center justify-center text-gray-500 italic text-center mb-4">
        Token not found.
      </p>
    );

  return (
    <div className="flex flex-col items-center bg-gray-100 mb-4">
      <button
        onClick={() => navigate(previousPage)}
        className="px-4 py-2 mb-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500 cursor-pointer"
      >
        <i className="fa-solid fa-left-long mr-2"></i> Back
      </button>
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          {token.name}
        </h1>
        {token.imageUri && (
          <img
            src={token.imageUri}
            alt={token.name}
            className="block mx-auto rounded-lg border border-gray-300 object-cover max-w-xs mb-4"
          />
        )}
        <div className="text-center mb-4">
          <p className="text-gray-700 my-2">
            <strong>Type:</strong> {token.typeLine || "No type available"}
          </p>
          {token.oracleText?.trim() && (
            <p className="text-gray-700 my-2">
              <strong>Text:</strong> {token.oracleText}
            </p>
          )}
          {token.power?.trim() !== "N/A" &&
            token.toughness?.trim() !== "N/A" && (
              <p className="text-gray-700 my-2">
                <strong>Power/Toughness:</strong> {token.power} /{" "}
                {token.toughness}
              </p>
            )}
          <p className="text-gray-700 my-2">
            <strong>Artist:</strong> {token.artist || "Unknown"}
          </p>
        </div>

        {loggedInUser && (
          <div className="max-w-xs mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Add to Palette
            </h3>
            <select
              value={selectedPalette}
              onChange={(e) => setSelectedPalette(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">-- Select a Palette --</option>
              {tokenPalettes.map((palette) => (
                <option key={palette.id} value={palette.id}>
                  {palette.name}
                </option>
              ))}
            </select>
            {selectedPalette && (
              <AddTokenToPalette
                tokenPaletteId={selectedPalette}
                oracleId={oracleId!}
                side={Number(side)}
                triggerBackend={true}
                onTokenAdd={handleTokenAddition}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenDetailsPage;
