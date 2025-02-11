import { useState } from "react";
import { TokenPaletteType } from "../../types/types";

interface TokenPaletteProps {
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  palettes: TokenPaletteType[];
}

const TokenPalette = ({ onSelect, onCreate, palettes }: TokenPaletteProps) => {
  const [paletteName, setPaletteName] = useState("");

  const handleCreate = async () => {
    if (paletteName.trim()) {
      onCreate(paletteName);
      setPaletteName("");
    }
  };

  return (
    <div>
      <h2>Create a New Token Palette</h2>
      <input
        value={paletteName}
        onChange={(e) => setPaletteName(e.target.value)}
      />
      <button onClick={handleCreate}>Create Palette</button>

      <h3>Existing Palettes</h3>
      <ul>
        {palettes.map((palette) => (
          <li key={palette.id} onClick={() => onSelect(palette.id)}>
            {palette.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenPalette;
