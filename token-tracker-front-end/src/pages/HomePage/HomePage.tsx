import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Search from "../../components/Search/Search";
import SearchResults from "../../components/SearchResults/SearchResults";
import GameInfo from "../../components/GameInfo/GameInfo";
import {
  searchTokens,
  fetchTokenPalettes,
  fetchCurrentGame,
  addTokenToPalette,
} from "../../services/api";
import {
  TokenSearchResult,
  TokenPaletteType,
  GameInstance,
} from "../../types/types";
import "../../assets/styles/App.css";

const HomePage = () => {
  const { loggedInUser } = useAuth();
  const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokenPalettes, setTokenPalettes] = useState<TokenPaletteType[]>([]);
  const [selectedPalettes, setSelectedPalettes] = useState<{
    [key: string]: string;
  }>({});
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameInstance | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTokenPalettes().then(setTokenPalettes);
    fetchCurrentGame().then(setCurrentGame);
  }, []);

  useEffect(() => {
    setSearchResults([]);
    setSearchPerformed(false);
  }, [location.pathname]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchPerformed(true);
    setShowLoginMessage(!loggedInUser);

    try {
      const results = await searchTokens(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaletteChange = async (
    oracleId: string,
    side: number,
    paletteId: string,
  ) => {
    setSelectedPalettes((prev) => ({
      ...prev,
      [`${oracleId}-${side}`]: paletteId,
    }));

    if (paletteId) {
      try {
        await addTokenToPalette(paletteId, oracleId, side);
      } catch (error) {
        console.error("Error adding token to palette from Home:", error);
        alert("Failed to add token to palette.");
      }
    }
  };

  return (
    <div>
      <Search onSearch={handleSearch} loading={loading} />

      {showLoginMessage && (
        <p className="login-message">
          Log in or create an account to add tokens to a palette.
        </p>
      )}

      {loading && <p>Loading...</p>}

      {!loading && searchPerformed && searchResults.length === 0 && (
        <p className="no-results">No results found.</p>
      )}

      {!loading && searchResults.length > 0 && (
        <SearchResults
          results={searchResults}
          tokenPalettes={tokenPalettes}
          selectedPalettes={selectedPalettes}
          onPaletteChange={handlePaletteChange}
          defaultSelectedPalette=""
          currentGameId={currentGame?.id || null}
          renderButtonsWithBackendTrigger={true}
        />
      )}

      <h2>Games</h2>
      <button onClick={() => navigate("/start-game")}>
        {currentGame ? "Start New Game (Replaces Current)" : "Start New Game"}
      </button>

      {currentGame ? (
        <div>
          <h3>Current Game</h3>
          <GameInfo game={currentGame} showResumeButton={true} />
        </div>
      ) : (
        <p>No active game. Start a new one!</p>
      )}
    </div>
  );
};

export default HomePage;
