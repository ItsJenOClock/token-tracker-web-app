import { useState } from "react";
import { Link } from "react-router";
import "../../assets/styles/App.css";

interface AddTokenToPaletteProps {
  tokenPaletteId: string;
  oracleId: string;
  side: number;
  onTokenAdd: () => void;
  triggerBackend?: boolean;
}

const AddTokenToPalette = ({
                             onTokenAdd,
                             triggerBackend = true,
                             tokenPaletteId,
                           }: AddTokenToPaletteProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleAdd = async () => {
    if (triggerBackend && onTokenAdd) {
      try {
        await onTokenAdd();
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      } catch (error) {
        console.error("Error handling token addition:", error);
        alert("An error occurred while adding the token. Please try again.");
      }
    } else {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer mt-4 w-full"
      >
        <i class="fa-solid fa-plus"></i> Add to Palette
      </button>

      {showModal && (
        <div
          className={`fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50`}
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
                Token added to the{" "}
                <Link
                  to={`/token-palettes/${tokenPaletteId}`}
                  className="text-blue-500 underline"
                >
                  palette
                </Link>
                ! 🎉
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTokenToPalette;