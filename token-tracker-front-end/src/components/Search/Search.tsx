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
      setSearchParams({ q: input });
      onSearch(input);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for a token..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default Search;
