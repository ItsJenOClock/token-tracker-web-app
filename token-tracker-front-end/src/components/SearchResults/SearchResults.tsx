import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { TokenSearchResult, TokenPaletteType } from "../../types/types";
import AddTokenToPalette from "../AddTokenToPalette/AddTokenToPalette.tsx";

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
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

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
      setTimeout(() => setGameConfirmation(null), 2000);
    } catch (error) {
      console.error("Error adding token to game:", error);
      alert(
        "An error occurred while adding the token to the game. Please try again.",
      );
    }
  };

  const toggleImageEnlarge = (imageUri: string | null) => {
    setEnlargedImage(imageUri);
  };

  if (!results || results.length === 0) {
    return (
      <p className="italic text-gray-500 text-center mt-6">
        No results found. Try searching for something else.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100">
      <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg border border-gray-300">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
          Search Results
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 list-none">
          {results.map((card) => {
            if (!card || !card.oracleId) return null;

            const key = `${card.oracleId}-${card.side}`;
            const selectedPaletteValue = localSelectedPalettes[key] || "";

            return (
              <li
                key={key}
                className="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition mb-4"
              >
                <Link
                  to={`/token/${card.oracleId}/${card.side}`}
                  state={{
                    from: location.pathname + location.search,
                    tokenPalettes,
                  }}
                  className="no-underline text-blue-500 hover:underline block text-center"
                >
                  <strong className="block">{card.name}</strong>
                </Link>

                <p className="text-gray-700 text-center">{card.typeLine || "Unknown Type"}</p>

                {card.imageUri ? (
                  <img
                    src={card.imageUri}
                    alt={card.name}
                    loading="lazy"
                    className="token-image max-w-[150px] block my-3 mx-auto rounded-lg border border-gray-300 cursor-pointer"
                    onClick={() => toggleImageEnlarge(card.imageUri)}
                  />
                ) : (
                  <p className="text-gray-500 italic">No image available</p>
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
                      className="border border-gray-300 rounded-lg p-2 w-full mt-2"
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
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            handleAddToGameWithConfirmation(
                              card.oracleId,
                              card.side,
                            )
                          }
                          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
                        >
                          Add to Current Game
                        </button>
                        {gameConfirmation === `${card.oracleId}-${card.side}` && (
                          <p className="text-green-500 mt-2 text-center">
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

      {enlargedImage && (
        <div
          className="fixed inset-0  flex items-center justify-center z-50"
          onClick={() => toggleImageEnlarge(null)}
        >
          <div
            className="relative w-[75%] max-w-xl bg-white rounded-lg shadow-lg border border-gray-300 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => toggleImageEnlarge(null)}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 cursor-pointer"
              aria-label="Close"
            >
              <i class="fa-solid fa-circle-xmark w-6 h-6"></i>
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged token"
              className="m-auto rounded-lg w-full object-contain"
              style={{ maxHeight: "80vh" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;