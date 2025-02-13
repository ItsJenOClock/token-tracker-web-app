import { useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

const Search = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 mb-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Token Search
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-auto flex-1 border border-gray-300 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Enter token name"
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md focus:outline-none focus:ring focus:ring-blue-400 cursor-pointer"
          >
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
