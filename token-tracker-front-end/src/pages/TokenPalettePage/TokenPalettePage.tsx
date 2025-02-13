import { useState, useEffect } from "react";
import { fetchTokenPalettes, createTokenPalette } from "../../services/api";
import { TokenPaletteType } from "../../types/types";
import { useNavigate } from "react-router";
import "../../assets/styles/App.css";
import TokenPalette from "../../components/TokenPalette/TokenPalette.tsx";

const TokenPalettePage = () => {
  const [palettes, setPalettes] = useState<TokenPaletteType[]>([]);
  const [paletteName, setPaletteName] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentPaletteId, setCurrentPaletteId] = useState<string | null>(null)


  useEffect(() => {
    fetchTokenPalettes()
      .then(setPalettes)
      .catch((error) => console.error("Failed to fetch palettes:", error));
  }, []);

  const handleCreatePalette = async () => {
    if (!paletteName.trim()) return;
    try {
      const newPalette = await createTokenPalette(paletteName);
      setPalettes((prev) => [...prev, newPalette]);
      setPaletteName("");
      setCurrentPaletteId(newPalette.id);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to create palette:", error);
      alert("Failed to create palette.");
    }
  };

  const handlePaletteClick = (id: string) => {
    navigate(`/token-palettes/${id}`);
  };


  return (
    <div className="flex flex-col items-center bg-gray-100 mt-4">
      <TokenPalette
        onSelect={handlePaletteClick}
        onCreate={handleCreatePalette}
        palettes={palettes}
        paletteName={paletteName}
        setPaletteName={setPaletteName}
      />

      {showModal && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex justify-start items-center z-50"
          aria-labelledby="confirmation-modal"
          aria-hidden={!showModal}
        >
          <div className="relative bg-white w-full max-w-sm mx-auto rounded-lg shadow-md p-4 border border-gray-300 pb-2">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-medium text-gray-900 text-center">Success</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 cursor-pointer"
                aria-label="Close"
              >
                <i className="fa-solid fa-circle-xmark w-6 h-6"></i>
              </button>
            </div>

            <div className="py-4 text-center">
              <p className="text-sm text-gray-500">
                <a
                  href={`/token-palettes/${currentPaletteId}`}
                  className="text-blue-500 underline text-sm"
                >
                  Token palette
                </a> created! 🎉
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenPalettePage;
