import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  fetchPaletteById,
  deleteToken,
  fetchTokensByPalette,
  updateTokenPaletteName,
  deleteTokenPalette,
  searchTokens,
  fetchAllPalettesApi,
  addTokenToPalette,
} from "../../services/api";
import { Token, TokenPaletteType, TokenSearchResult } from "../../types/types";
import Search from "../../components/Search/Search";
import SearchResults from "../../components/SearchResults/SearchResults";
import "../../assets/styles/App.css";

const TokenPaletteDetailPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [palette, setPalette] = useState<TokenPaletteType | null>(null);
  const [newPaletteName, setNewPaletteName] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [allPalettes, setAllPalettes] = useState<TokenPaletteType[]>([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No Token Palette ID provided.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const paletteData = await fetchPaletteById(id);
        if (!paletteData || !paletteData.name) {
          throw new Error("Invalid palette data returned from API.");
        }
        setPalette(paletteData);
        setNewPaletteName(paletteData.name);

        const allPalettesData = await fetchAllPalettesApi();
        setAllPalettes(allPalettesData);
        const tokensData = await fetchTokensByPalette(id);
        setTokens(tokensData);
      } catch (error: any) {
        console.error("Error fetching palette details or all palettes:", error);
        setError(`Failed to load palette details. Reason: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    setSearchPerformed(true);
    try {
      const results = await searchTokens(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDeleteToken = async (token: Token) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${token.tokenType.name}?`,
      )
    )
      return;
    await deleteToken(token.id);
    setTokens(tokens.filter((t) => t.id !== token.id));
  };

  const handleEditPaletteName = async () => {
    if (!id || newPaletteName.trim() === "" || newPaletteName === palette?.name)
      return;
    try {
      await updateTokenPaletteName(id, newPaletteName);
      setPalette((prev) => (prev ? { ...prev, name: newPaletteName } : null));
      setEditing(false);
    } catch (error) {
      console.error("Failed to update palette name", error);
      alert("Failed to update palette name.");
    }
  };

  const handleDeletePalette = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this palette?"))
      return;
    try {
      await deleteTokenPalette(id);
      alert("Palette deleted successfully!");
      navigate("/token-palettes");
    } catch (error) {
      console.error("Failed to delete palette:", error);
      alert("Failed to delete the palette.");
    }
  };

  const handlePaletteChange = async (
    oracleId: string,
    side: number,
    paletteId: string,
  ) => {
    if (!paletteId) {
      console.error("No palette selected. Cannot add token.");
      return;
    }

    try {
      await addTokenToPalette(paletteId, oracleId, side);
      if (paletteId === palette?.id) {
        const updatedTokens = await fetchTokensByPalette(paletteId);
        setTokens(updatedTokens);
      }
    } catch (error) {
      console.error("Failed to add token to palette:", error);
      alert("Unable to add the token. Please try again.");
    }
  };

  if (!id) return <div>Error: No Token Palette ID provided.</div>;
  if (loading) return <p>Loading palette details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="token-palette-container">
      <button
        onClick={() => setShowSearch((prev) => !prev)}
        className="search-toggle-button"
      >
        {showSearch ? "Hide Search" : "Show Search"}
      </button>

      {showSearch && (
        <>
          <div className="search-container">
            <h2>Search Tokens</h2>
            <Search onSearch={handleSearch} loading={searchLoading} />
            {searchLoading && <p>Searching...</p>}
          </div>

          {searchPerformed && (
            <div className="search-results-container">
              <h2>Search Results</h2>
              {searchResults.length > 0 ? (
                <SearchResults
                  results={searchResults}
                  tokenPalettes={allPalettes}
                  selectedPalettes={{}}
                  onPaletteChange={handlePaletteChange}
                  currentGameId={null}
                  defaultSelectedPalette={palette?.id || null}
                />
              ) : (
                !searchLoading && (
                  <p className="no-results">No results found.</p>
                )
              )}
            </div>
          )}
        </>
      )}

      <h1>Token Palette Details</h1>
      <div className="search-toggle-button">
        {editing ? (
          <>
            <input
              type="text"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
              className="input-with-margin"
            />
            <button
              onClick={handleEditPaletteName}
              disabled={newPaletteName === palette?.name}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="button-with-margin"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2>{palette?.name}</h2>
            <button onClick={() => setEditing(true)}>Edit Name</button>
          </>
        )}
        <button onClick={handleDeletePalette}>Delete Palette</button>
      </div>

      <button
        className="back-button"
        onClick={() => navigate("/token-palettes")}
      >
        Back to Palettes
      </button>
      <button
        className="new-game-button"
        onClick={() => navigate("/start-game")}
      >
        New Game
      </button>

      <ul className="token-list">
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
            {token.tokenType.art && (
              <img src={token.tokenType.art} alt={token.tokenType.name} />
            )}
            <br />
            <button
              className="delete-button"
              onClick={() => handleDeleteToken(token)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenPaletteDetailPage;
