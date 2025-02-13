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
  const {id} = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameInstance | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [gameTokens, setGameTokens] = useState<GameToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTokenPalette, setShowTokenPalette] = useState(false);
  const [allPalettes, setAllPalettes] = useState<TokenPaletteType[]>([]);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"deleteToken" | "endGame" | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<GameToken | null>(null);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const openConfirmationModal = (type: "deleteToken" | "endGame", token?: GameToken) => {
    setModalType(type);
    setSelectedToken(token || null);
    setShowModal(true);
  };

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

  const handleConfirmAction = async () => {
    setConfirmationLoading(true);

    try {
      if (modalType === "deleteToken" && selectedToken) {
        await deleteGameToken(id!, selectedToken.id);
        setGameTokens((prevTokens) => prevTokens.filter((t) => t.id !== selectedToken.id));
      } else if (modalType === "endGame") {
        await endGame(id!);
        navigate("/");
      }
    } catch (error) {
      console.error("Error handling confirmation action:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setConfirmationLoading(false);
      setShowModal(false);
      setSelectedToken(null);
    }
  };

  const handleAddGameToken = async (
    gameId: string,
    oracleId: string,
    side: number,
  ) => {
    try {
      const addedToken = await addTokenToCurrentGame(gameId, oracleId, side);
      setGameTokens((prevTokens) => [...prevTokens, addedToken]);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
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
          token.id === tokenId ? {...token, ...updatedToken} : token,
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
    openConfirmationModal("endGame");
    navigate("/");
  };

  const toggleImageEnlarge = (imageUri: string | null) => {
    setEnlargedImage(imageUri);
  };


  if (loading) return <p className="flex items-center justify-center text-gray-500 italic">Loading game...</p>;
  if (error) return <p className="flex items-center justify-center text-gray-500 italic">{error}</p>;
  if (!game) return <p className="flex items-center justify-center text-gray-500 italic">Game not found.</p>;

  return (
    <div>
      <div className="w-full flex flex-col items-center bg-gray-100">
        <button
          onClick={() => setShowSearch((prev) => !prev)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer mb-4"
        >
          {showSearch ? (
            <>
              <i className="fa-solid fa-eye-slash"></i> Hide Search
            </>
          ) : (
            <>
              <i className="fa-solid fa-eye"></i> Show Search
            </>
          )}
        </button>

        {showSearch && (
          <div className="flex flex-col gap-4">
            <div>
              <Search onSearch={handleSearch} loading={searchLoading}/>
              {searchLoading && (
                <p className="flex items-center justify-center text-gray-500 italic mb-4"><i className="fa-solid fa-spinner fa-spin"></i></p>
              )}

              {!searchLoading && searchPerformed && searchResults.length === 0 && (
                <p className="flex items-center justify-center text-gray-500 italic w-auto">
                  No results found.
                </p>
              )}
            </div>

            {searchPerformed && (
              <div>
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
                ) : ""}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setShowTokenPalette((prev) => !prev)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md focus:outline-none focus:ring focus:ring-blue-400 cursor-pointer mb-4"
        >
          {showTokenPalette ? (
            <>
              <i className="fa-solid fa-eye-slash"></i> Hide Token Palette
            </>
          ) : (
            <>
              <i className="fa-solid fa-eye"></i> Show Token Palette
            </>
          )}
        </button>
        <div className="flex flex-col items-center bg-gray-100">
          {showTokenPalette && (
            <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg border border-gray-300 mb-4">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Token Palette: {game?.tokenPalette?.name}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 list-none">
                {tokens.map((token) => (
                  <li
                    key={token.id}
                    className="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition mb-4"
                  >
                    <Link
                      to={`/token/${token.tokenType.oracleId}/${token.tokenType.side}`}
                      state={{
                        from: location.pathname + location.search,
                        tokenPalettes: allPalettes,
                      }}
                      className="text-blue-500 hover:underline block text-center"
                    >
                      <strong>{token.tokenType.name}</strong>
                    </Link>

                    {token.tokenType.art ? (
                      <img
                        src={token.tokenType.art}
                        alt={token.tokenType.name}
                        className="max-w-[150px] block my-3 mx-auto rounded-lg border border-gray-300 cursor-pointer"
                        onClick={() => toggleImageEnlarge(token.tokenType.art)}
                      />
                    ) : (
                      <p className="text-gray-500 italic">No image available</p>
                    )}

                    <button
                      onClick={() =>
                        handleAddGameToken(
                          game.id,
                          token.tokenType.oracleId,
                          token.tokenType.side,
                        )
                      }
                      className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                    >
                      <i className="fa-solid fa-plus"></i> Add to Game
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mb-4 flex gap-4 items-center justify-center">
          <button
            onClick={handleStartNextTurn}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer"
          >
            <i class="fa-solid fa-forward-step"></i> Next Turn
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer"
          >
            <i className="fa-solid fa-pause"></i> Pause Game
          </button>

          <button
            onClick={() => openConfirmationModal("endGame")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
          >
            <i className="fa-solid fa-stop"></i> End Game
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center bg-gray-100">
        <div className="bg-white w-full max-w-6xl pl-8 pt-4 pb-4 rounded-lg shadow-lg border border-gray-300 mb-4">
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
            Game Tokens
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 list-none">
            {gameTokens.map((gameToken) => (
              <li className="p-4 rounded-lg shadow-md" key={gameToken.id}>
                <img
                  src={gameToken.tokenType.art}
                  alt={gameToken.tokenType.name}
                  className={`max-w-[200px] cursor-pointer rounded-md mb-2 transform transition-transform ease-in-out ${
                    gameToken.isTapped ? "rotate-90" : "rotate-0"
                  } ${gameToken.isSick ? "border-gray-400 border-4 border-dashed" : ""}`}
                  onClick={() =>
                    handleUpdateGameToken(gameToken.id, {
                      isTapped: !gameToken.isTapped,
                    })
                  }
                />
                <div className="flex-col">
                  <button
                    onClick={() =>
                      handleUpdateGameToken(gameToken.id, {
                        counters: gameToken.counters - 1,
                      })
                    }
                    className="px-4 py-3 hover:text-red-600 text-red-500 text-xl cursor-pointer"
                  >
                    <i className="fa-solid fa-circle-minus"></i>
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
                    className="px-4 py-3 hover:text-green-600 text-green-500 text-xl cursor-pointer mr-2"
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>
                  <button
                    onClick={() => openConfirmationModal("deleteToken", gameToken)}
                    // onClick={() => handleDeleteGameToken(gameToken.id)}
                    className="px-4 py-3 text-stone-500 hover:text-stone-600 text-xl cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {enlargedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
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
              <i className="fa-solid fa-circle-xmark w-6 h-6"></i>
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

      {showSuccessModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="relative bg-white w-full max-w-sm mx-auto rounded-lg shadow-md p-4 border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-medium text-gray-900 text-center">
                Success
              </h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 cursor-pointer"
              >
                <i className="fa-solid fa-circle-xmark w-6 h-6"></i>
              </button>
            </div>

            <div className="py-4 text-center">
              <p className="text-sm text-gray-500">Token added to the board! 🎉</p>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-sm mx-auto rounded-lg shadow-md p-4 border border-gray-300">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === "deleteToken" ? "Delete Token" : "End Game"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 cursor-pointer"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            </div>
            <div className="py-4 text-center">
              <p className="text-sm text-gray-500">
                {modalType === "deleteToken"
                  ? `Are you sure you want to delete the token "${selectedToken?.tokenType.name}"?`
                  : "Are you sure you want to end this game?"}
              </p>
              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-sm font-semibold bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
                >
                  <i className="fa-solid fa-rotate-left"></i> No, Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-6 py-2 text-white rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    confirmationLoading
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  disabled={confirmationLoading}
                >
                  {confirmationLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      {modalType === "deleteToken" ? "Deleting..." : "Ending..."}
                    </>
                  ) : (
                    <>
                      <i
                        className={`fa-solid ${
                          modalType === "deleteToken" ? "fa-trash-can" : "fa-hourglass-end"
                        }`}
                      ></i>
                      {modalType === "deleteToken" ? "Yes, Delete" : "Yes, End Game"}
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default GameInstancePage;