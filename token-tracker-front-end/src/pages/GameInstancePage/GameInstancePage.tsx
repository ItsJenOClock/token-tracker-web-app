import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  fetchGameInstance,
  fetchGameTokens,
  updateGameToken,
  deleteGameToken,
  endGame,
  startNextTurn,
  addTokenToCurrentGame,
  fetchTokensByPalette,
  fetchAllPalettesApi,
  searchTokens,
  addTokenToPalette,
} from "../../services/api";
import {
  GameInstance,
  GameToken,
  Token,
  TokenSearchResult,
  TokenPaletteType,
} from "../../types/types";
import Search from "../../components/Search/Search";
import SearchResults from "../../components/SearchResults/SearchResults";
import "../../assets/styles/App.css";

const GameInstancePage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameInstance | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [gameTokens, setGameTokens] = useState<GameToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [showTokenPalette, setShowTokenPalette] = useState(true);
  const [allPalettes, setAllPalettes] = useState<TokenPaletteType[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadGame = async () => {
      try {
        const gameData = await fetchGameInstance(id);
        setGame(gameData);

        const tokenData = await fetchTokensByPalette(gameData.tokenPalette.id);
        setTokens(tokenData);

        const gameTokenData = await fetchGameTokens(id);
        setGameTokens(gameTokenData);

        const allPalettesData = await fetchAllPalettesApi();
        setAllPalettes(allPalettesData);
      } catch (err) {
        console.error("Error loading game data:", err);
        setError("Failed to load game.");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id]);

  const handleAddGameToken = async (
    gameId: string,
    oracleId: string,
    side: number,
  ) => {
    try {
      const addedToken = await addTokenToCurrentGame(gameId, oracleId, side);
      setGameTokens((prevTokens) => [...prevTokens, addedToken]);
    } catch (err) {
      console.error("Failed to add token to game:", err);
    }
  };

  const handleAddCurrentGameToken = async (oracleId: string, side: number) => {
    handleAddGameToken(game?.id || "", oracleId, side);
  };

  const handleUpdateGameToken = async (
    tokenId: string,
    updates: Partial<GameToken>,
  ) => {
    try {
      const currentToken = gameTokens.find((t) => t.id === tokenId);
      if (!currentToken) return;

      const updatedToken = await updateGameToken(id!, tokenId, {
        isSick: updates.isSick ?? currentToken.isSick,
        isTapped: updates.isTapped ?? currentToken.isTapped,
        counters: updates.counters ?? currentToken.counters,
      });

      setGameTokens((prevTokens) =>
        prevTokens.map((token) =>
          token.id === tokenId ? { ...token, ...updatedToken } : token,
        ),
      );
    } catch (err) {
      console.error("Failed to update token:", err);
    }
  };

  const handleDeleteGameToken = async (tokenId: string) => {
    const gameToken = gameTokens.find((t) => t.id === tokenId);

    if (!gameToken) {
      console.error(`Token with ID ${tokenId} not found`);
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${gameToken.tokenType.name}?`,
      )
    )
      return;

    try {
      await deleteGameToken(id!, tokenId);
      setGameTokens((prevTokens) =>
        prevTokens.filter((token) => token.id !== tokenId),
      );
    } catch (err) {
      console.error("Failed to delete token from game instance:", err);
      alert("Failed to delete token.");
    }
  };

  const handleAddToPalette = async (
    oracleId: string,
    side: number,
    paletteId: string,
  ) => {
    if (!paletteId) {
      console.error("No palette selected for adding the token.");
      alert("Please select a valid palette.");
      return;
    }

    try {
      await addTokenToPalette(paletteId, oracleId, side);
      const updatedTokens = await fetchTokensByPalette(paletteId);
      setTokens(updatedTokens);
    } catch (err) {
      console.error("Failed to add token to palette:", err);
      alert("Failed to add token to the palette. Please try again.");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    setSearchPerformed(true);

    try {
      const results = await searchTokens(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStartNextTurn = async () => {
    try {
      await startNextTurn(id!);
      setGameTokens((prevTokens) =>
        prevTokens.map((token) => ({
          ...token,
          isTapped: false,
          isSick: false,
        })),
      );
    } catch (err) {
      console.error("Failed to start next turn:", err);
    }
  };

  const handleEndGame = async () => {
    if (!window.confirm("Are you sure you want to end this game?")) return;
    await endGame(id!);
    navigate("/");
  };

  if (loading) return <p>Loading game...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!game) return <p>Game not found.</p>;

  return (
    <div>
      <button
        onClick={() => setShowSearch((prev) => !prev)}
        className="toggle-button"
      >
        {showSearch ? "Hide Search" : "Show Search"}
      </button>
      {showSearch && (
        <>
          <div className="result-item">
            <h2>Search Tokens</h2>
            <Search onSearch={handleSearch} loading={searchLoading} />
            {searchLoading && <p className="search-loading">Searching...</p>}
          </div>

          {searchPerformed && (
            <div className="search-results-container">
              <h2>Search Results</h2>
              {searchResults.length > 0 ? (
                <SearchResults
                  results={searchResults}
                  tokenPalettes={allPalettes}
                  selectedPalettes={{}}
                  onPaletteChange={handleAddToPalette}
                  defaultSelectedPalette={game?.tokenPalette.id || ""}
                  currentGameId={game?.id || null}
                  onAddToGame={handleAddCurrentGameToken}
                />
              ) : (
                !searchLoading && (
                  <p className="search-loading">No results found.</p>
                )
              )}
            </div>
          )}
        </>
      )}
      <button
        onClick={() => setShowTokenPalette((prev) => !prev)}
        className="search-toggle-button"
      >
        {showTokenPalette ? "Hide Token Palette" : "Show Token Palette"}
      </button>

      {showTokenPalette && (
        <>
          <h2>Token Palette: {game?.tokenPalette?.name}</h2>
          <ul>
            {tokens.map((token) => (
              <li key={token.id}>
                <Link
                  to={`/token/${token.tokenType.oracleId}/${token.tokenType.side}`}
                  state={{
                    from: location.pathname + location.search,
                    tokenPalettes: allPalettes,
                  }}
                  className="search-link"
                >
                  <strong>{token.tokenType.name}</strong>
                </Link>{" "}
                - {token.tokenType.type}
                <br />
                <img src={token.tokenType.art} alt={token.tokenType.name} />
                <br />
                <button
                  onClick={() =>
                    handleAddGameToken(
                      game.id,
                      token.tokenType.oracleId,
                      token.tokenType.side,
                    )
                  }
                >
                  Add Instance
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <h2>Game Actions</h2>
      <button onClick={handleStartNextTurn}>Start Next Turn</button>
      <button onClick={handleEndGame}>End Game</button>

      <h2>Game Tokens</h2>
      <ul>
        {gameTokens.map((gameToken) => (
          <li key={gameToken.id}>
            <img
              src={gameToken.tokenType.art}
              alt={gameToken.tokenType.name}
              onClick={() =>
                handleUpdateGameToken(gameToken.id, {
                  isTapped: !gameToken.isTapped,
                })
              }
              className={`game-token ${gameToken.isTapped ? "tapped" : ""} ${gameToken.isSick ? "sick" : ""}`}
            />
            <strong>Counters:</strong>
            <button
              onClick={() =>
                handleUpdateGameToken(gameToken.id, {
                  counters: gameToken.counters - 1,
                })
              }
            >
              -
            </button>
            {gameToken.counters >= 0
              ? `+${gameToken.counters}/+${gameToken.counters}`
              : `${gameToken.counters}/${gameToken.counters}`}
            <button
              onClick={() =>
                handleUpdateGameToken(gameToken.id, {
                  counters: gameToken.counters + 1,
                })
              }
            >
              +
            </button>
            <button onClick={() => handleDeleteGameToken(gameToken.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameInstancePage;
