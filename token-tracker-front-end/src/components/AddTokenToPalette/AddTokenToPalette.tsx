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
    const [confirmation, setConfirmation] = useState(false);

    const handleAdd = async () => {
        if (triggerBackend && onTokenAdd) {
            try {
                await onTokenAdd();
                setConfirmation(true);
                setTimeout(() => setConfirmation(false), 3000);
            } catch (error) {
                console.error("Error handling token addition:", error);
                alert("An error occurred while adding the token. Please try again.");
            }
        } else {
            setConfirmation(true);
            setTimeout(() => setConfirmation(false), 3000);
        }
    };

    return (
      <div className="flex justify-center items-center">
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:opacity-90 cursor-pointer mt-4 ">
            Add to Palette
          </button>
          {confirmation && (
            <p className="text-green-500">
                Token added to{" "}
                <Link to={`/token-palettes/${tokenPaletteId}`} className="text-blue-500 underline">
                    palette
                </Link>
                !
            </p>
          )}
      </div>
    );
};

export default AddTokenToPalette;
