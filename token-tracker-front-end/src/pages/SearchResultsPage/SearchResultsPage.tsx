import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  fetchCurrentGame,
  fetchTokenPalettes,
  searchTokens,
  addTokenToCurrentGame,
} from "../../services/api";
import SearchResults from "../../components/SearchResults/SearchResults";
import { TokenPaletteType } from "../../types/types";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenPalettes, setTokenPalettes] = useState<TokenPaletteType[]>([]);
  const [currentGame, setCurrentGame] = useState<any | null>(null);

  const fetchInitialData = async () => {
    try {
      const [fetchedTokens, fetchedPalettes, fetchedGame] = await Promise.all([
        query ? searchTokens(query) : [],
        fetchTokenPalettes(),
        fetchCurrentGame(),
      ]);
      setResults(fetchedTokens);
      setTokenPalettes(fetchedPalettes);
      setCurrentGame(fetchedGame);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCurrentGame(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGame = async (oracleId: string, side: number) => {
    if (!currentGame || !currentGame.id) {
      alert("No active game found. Please start one first.");
      return;
    }

    try {
      await addTokenToCurrentGame(currentGame.id, oracleId, side);
      alert("Token successfully added to the current game!");
    } catch (error) {
      console.error("Failed to add token:", error);
      alert("Failed to add token to the current game.");
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [query]);

  if (loading) {
    return <p className="flex items-center justify-center text-gray-500 italic mb-4"><i className="fa-solid fa-spinner fa-spin"></i></p>
  }

  return (
    <div>
      <h2>Search Results</h2>
      <SearchResults
        results={results}
        tokenPalettes={tokenPalettes}
        selectedPalettes={{}}
        currentGameId={currentGame.id}
        onAddToGame={handleAddToGame}
        onPaletteChange={(oracleId, side, paletteId) => {
          console.log(
            `Palette changed: oracleId=${oracleId}, side=${side}, paletteId=${paletteId}`,
          );
        }}
      />
    </div>
  );
};

export default SearchResultsPage;
