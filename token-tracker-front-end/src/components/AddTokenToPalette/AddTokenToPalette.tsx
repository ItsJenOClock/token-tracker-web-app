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
      <div>
          <button onClick={handleAdd}>Add to Palette</button>
          {confirmation && (
            <p className="confirmation-message">
                Token added to{" "}
                <Link to={`/token-palettes/${tokenPaletteId}`} className="link">
                    palette
                </Link>
                !
            </p>
          )}
      </div>
    );
};

export default AddTokenToPalette;
