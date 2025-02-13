import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
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
        <p className="flex items-center justify-center text-gray-500 mb-4">
          <span>
            <Link
              to="/login"
              className="text-blue-500 hover:underline  transition-colors"
            >
              Log in or create an account
            </Link>{" "}
            for full access.
          </span>
        </p>
      )}

      {loading && (
        <p className="flex items-center justify-center text-gray-500 italic mb-4">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </p>
      )}

      {!loading && searchPerformed && searchResults.length === 0 && (
        <p className="flex items-center justify-center text-gray-500 italic mb-4">
          No results found.
        </p>
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

      {currentGame ? (
        <div>
          <GameInfo game={currentGame} showResumeButton={true} />
        </div>
      ) : (
        ""
      )}

      <div className="flex flex-col items-center bg-gray-100 mt-4 mb-4">
        <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            New Game
          </h2>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/start-game")}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-hourglass-start"></i>
              {currentGame ? "Start New Game" : "Start New Game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
