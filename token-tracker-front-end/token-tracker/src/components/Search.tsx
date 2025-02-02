import { useState } from "react";

interface SearchProps {
    onSearch: (query: string) => void;
    loading: boolean;
}

const Search = ({ onSearch, loading }: SearchProps) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
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