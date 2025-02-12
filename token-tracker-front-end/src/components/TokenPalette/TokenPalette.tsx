import { TokenPaletteType } from "../../types/types";

interface TokenPaletteProps {
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  palettes: TokenPaletteType[];
  paletteName: string;
  setPaletteName: (value: string) => void;
}

const TokenPalette = ({ onSelect, onCreate, palettes, paletteName, setPaletteName }: TokenPaletteProps) => {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create a New Token Palette
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            className="w-full sm:w-auto flex-1 border border-gray-300 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Enter palette name"
          />
          <button
            onClick={onCreate}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md focus:outline-none focus:ring focus:ring-blue-400 cursor-pointer"
          >
            <i class="fa-solid fa-plus"></i> Create
          </button>
        </div>
      </div>

      <div className="mt-12 bg-white w-full max-w-xl p-6 rounded-lg shadow-lg border border-gray-300">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
          Existing Palettes
        </h3>
        {palettes.length > 0 ? (
          <ul className="space-y-4">
            {palettes.map((palette) => (
              <li
                key={palette.id}
                onClick={() => onSelect(palette.id)}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-center cursor-pointer hover:bg-gray-200 transition"
              >
                {palette.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-500 text-center">
            No palettes available. Create one above to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default TokenPalette;