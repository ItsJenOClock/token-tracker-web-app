import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

interface SearchProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

const Search = ({ onSearch, loading }: SearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      onSearch(query);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({q: input});
      onSearch(input);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 bg-gray-50 p-3 rounded shadow-md max-w-lg mx-auto"
    >
      <input
        type="text"
        placeholder="Search for a token..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-300 focus:outline-none text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 bg-blue-500 text-white rounded font-medium cursor-pointer ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Search;
