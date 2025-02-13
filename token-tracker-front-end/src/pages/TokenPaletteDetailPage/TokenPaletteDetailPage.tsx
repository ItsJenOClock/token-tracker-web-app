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
  const [allPalettes, setAllPalettes] = useState<TokenPaletteType[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [modalType, setModalType] = useState<
    "deletePalette" | "deleteToken" | null
  >(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

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

  const handleEditPaletteName = async () => {
    if (!id || newPaletteName.trim() === "" || newPaletteName === palette?.name)
      return;

    try {
      await updateTokenPaletteName(id, newPaletteName);
      setPalette((prev) => (prev ? { ...prev, name: newPaletteName } : null));
      setEditing(false);
    } catch (error) {
      console.error("Failed to update palette name", error);
      setError("Failed to update palette name.");
    }
  };

  const openDeletePaletteModal = () => {
    setModalType("deletePalette");
    setShowModal(true);
  };

  const openDeleteTokenModal = (token: Token) => {
    setSelectedToken(token);
    setModalType("deleteToken");
    setShowModal(true);
  };

  const toggleImageEnlarge = (imageUri: string | null) => {
    setEnlargedImage(imageUri);
  };

  const handleConfirmDelete = async () => {
    setConfirmationLoading(true);

    try {
      if (modalType === "deletePalette" && id) {
        await deleteTokenPalette(id);
        navigate("/token-palettes");
      } else if (modalType === "deleteToken" && selectedToken) {
        await deleteToken(selectedToken.id);
        setTokens(tokens.filter((t) => t.id !== selectedToken.id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("An error occurred while deleting. Please try again.");
    } finally {
      setConfirmationLoading(false);
      setShowModal(false);
      setSelectedToken(null);
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
      setError("Unable to add the token. Please try again.");
    }
  };

  if (loading) {
    return (
      <p className="flex items-center justify-center text-gray-500 italic">
        <i className="fa-solid fa-spinner fa-spin"></i>
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500 italic text-center">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center bg-gray-100">
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
        <div className="flex flex-col gap-4 w-full">
          <div>
            <Search onSearch={handleSearch} loading={searchLoading} />
            {searchLoading && (
              <p className="flex items-center justify-center text-gray-500 italic mb-4">
                <i className="fa-solid fa-spinner fa-spin"></i>
              </p>
            )}

            {!searchLoading &&
              searchPerformed &&
              searchResults.length === 0 && (
                <p className="flex items-center justify-center text-gray-500 italic">
                  No results found.
                </p>
              )}
          </div>

          {searchPerformed && (
            <div className="search-results-container">
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
                ""
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg border border-gray-300 mb-4">
        <div className="flex justify-between items-center">
          {editing ? (
            <>
              <input
                type="text"
                value={newPaletteName}
                onChange={(e) => setNewPaletteName(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:ring focus:ring-blue-300"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditPaletteName}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                  disabled={newPaletteName === palette?.name}
                >
                  <i class="fa-solid fa-floppy-disk"></i> Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 cursor-pointer"
                >
                  <i class="fa-solid fa-rotate-left"></i> Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{palette?.name}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                  <i class="fa-solid fa-pen-to-square"></i> Edit Name
                </button>
                <button
                  onClick={openDeletePaletteModal}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                >
                  <i class="fa-solid fa-trash-can"></i> Delete Palette
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg border border-gray-300 mb-4">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
          Palette Tokens
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 list-none">
          {tokens.map((token) => (
            <li
              key={token.id}
              className="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <Link
                to={`/token/${token.tokenType.oracleId}/${token.tokenType.side}`}
                className="text-blue-500 hover:underline block text-center"
              >
                <strong className="block">{token.tokenType.name}</strong>
              </Link>
              {token.tokenType.art ? (
                <img
                  src={token.tokenType.art}
                  alt={token.tokenType.name}
                  loading="lazy"
                  className="token-image max-w-[150px] block my-3 mx-auto rounded-lg border border-gray-300 cursor-pointer"
                  onClick={() => toggleImageEnlarge(token.tokenType.art)}
                />
              ) : (
                <p className="text-gray-500 italic">No image available</p>
              )}

              <button
                onClick={() => openDeleteTokenModal(token)}
                className="px-4 py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600 w-full cursor-pointer"
              >
                <i class="fa-solid fa-trash-can"></i> Delete Token
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-sm mx-auto rounded-lg shadow-md p-4 border border-gray-300">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === "deletePalette"
                  ? "Delete Palette"
                  : "Delete Token"}
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
                Are you sure you want to{" "}
                {modalType === "deletePalette"
                  ? "delete this palette?"
                  : `delete the token "${selectedToken?.tokenType.name}"?`}
              </p>
              <div className="flex justify-center mt-4 gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 ml-4 text-sm font-semibold bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
                >
                  <i className="fa-solid fa-rotate-left"></i> No, Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className={`px-6 py-2 text-white rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    confirmationLoading
                      ? "bg-red-600 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  disabled={confirmationLoading}
                >
                  {confirmationLoading ? (
                    <>
                      <i className="fa-solid fa-trash-can"></i> Deleting...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-trash-can"></i> Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default TokenPaletteDetailPage;
