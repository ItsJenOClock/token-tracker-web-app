import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { TokenSearchResult, TokenPaletteType } from "../../types/types";
import AddTokenToPalette from "../AddTokenToPalette/AddTokenToPalette.tsx";
import "../../assets/styles/App.css";

interface SearchResultsProps {
  results: TokenSearchResult[];
  tokenPalettes: TokenPaletteType[];
  selectedPalettes: { [key: string]: string };
  onPaletteChange: (oracleId: string, side: number, paletteId: string) => void;
  defaultSelectedPalette?: string;
  currentGameId: string | null;
  onAddToGame?: (oracleId: string, side: number) => void;
  renderButtonsWithBackendTrigger?: boolean;
}

const SearchResults = ({
                         results,
                         tokenPalettes,
                         selectedPalettes,
                         onPaletteChange,
                         defaultSelectedPalette,
                         onAddToGame,
                         renderButtonsWithBackendTrigger = true,
                       }: SearchResultsProps) => {
  const { loggedInUser } = useAuth();
  const location = useLocation();
  const [localSelectedPalettes, setLocalSelectedPalettes] = useState<{
    [key: string]: string;
  }>({});
  const [gameConfirmation, setGameConfirmation] = useState<string | null>(null);

  useEffect(() => {
    const initialSelections: { [key: string]: string } = {};
    results.forEach((result) => {
      const key = `${result.oracleId}-${result.side}`;
      initialSelections[key] =
        selectedPalettes?.[key] || defaultSelectedPalette || "";
    });
    setLocalSelectedPalettes(initialSelections);
  }, [results, selectedPalettes, defaultSelectedPalette]);

  const handleSelectionChange = (
    oracleId: string,
    side: number,
    selectedValue: string,
  ) => {
    const key = `${oracleId}-${side}`;
    setLocalSelectedPalettes((prev) => ({
      ...prev,
      [key]: selectedValue,
    }));
  };

  const handleAddToGameWithConfirmation = async (
    oracleId: string,
    side: number,
  ) => {
    if (!onAddToGame) return;

    try {
      await onAddToGame(oracleId, side);
      setGameConfirmation(`${oracleId}-${side}`);
      setTimeout(() => setGameConfirmation(null), 3000);
    } catch (error) {
      console.error("Error adding token to game:", error);
      alert(
        "An error occurred while adding the token to the game. Please try again.",
      );
    }
  };

  if (!results || results.length === 0) {
    return (
      <p className="no-results">No results found.</p>
    );
  }

  return (
    <div>
      <ul className="search-results">
        {results.map((card) => {
          if (!card || !card.oracleId) return null;

          const key = `${card.oracleId}-${card.side}`;
          const selectedPaletteValue = localSelectedPalettes[key] || "";

          return (
            <li key={key} className="result-item">
              <Link
                to={`/token/${card.oracleId}/${card.side}`}
                state={{
                  from: location.pathname + location.search,
                  tokenPalettes,
                }}
                className="search-link"
              >
                <strong>{card.name}</strong>
              </Link>{" "}
              - {card.typeLine || "Unknown Type"}
              <br />
              {card.imageUri ? (
                <img
                  src={card.imageUri}
                  alt={card.name}
                  loading="lazy"
                  className="token-image"
                />
              ) : (
                <p>No image available</p>
              )}
              {loggedInUser && (
                <div>
                  <select
                    value={selectedPaletteValue}
                    onChange={(e) =>
                      handleSelectionChange(
                        card.oracleId,
                        card.side,
                        e.target.value,
                      )
                    }
                  >
                    <option value="">-- Select a Palette --</option>
                    {tokenPalettes.map((palette) => (
                      <option key={palette.id} value={palette.id}>
                        {palette.name}
                      </option>
                    ))}
                  </select>
                  {selectedPaletteValue && (
                    <AddTokenToPalette
                      tokenPaletteId={selectedPaletteValue}
                      oracleId={card.oracleId}
                      side={card.side}
                      triggerBackend={renderButtonsWithBackendTrigger}
                      onTokenAdd={() =>
                        onPaletteChange(
                          card.oracleId,
                          card.side,
                          selectedPaletteValue,
                        )
                      }
                    />
                  )}
                  {onAddToGame && (
                    <div>
                      <button
                        onClick={() =>
                          handleAddToGameWithConfirmation(
                            card.oracleId,
                            card.side,
                          )
                        }
                      >
                        Add Instance to Current Game
                      </button>
                      {gameConfirmation === `${card.oracleId}-${card.side}` && (
                        <p className="confirmation-message">
                          Token added to the game!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchResults;
