import { TokenSearchResult, TokenPaletteType, Token } from "./types";

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
export const fetchTokenPalettes = async (): Promise<TokenPaletteType[]> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/token_palettes`);
    if (!response.ok) throw new Error("Failed to fetch token palettes");
    return response.json();
};

export const createTokenPalette = async (name: string): Promise<TokenPaletteType> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/token_palettes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to create token palette");
    return response.json();
};

export const addTokenToPalette = async (paletteId: string, oracleId: string, side: number): Promise<void> => {
    await fetch(`${VITE_APP_BACKEND_URL}/token_palettes/${paletteId}/add_token?oracleId=${oracleId}&side=${side}`, {
        method: "POST",
    });
};

export const searchTokens = async (query: string): Promise<TokenSearchResult[]> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/token_types/search?name=${encodeURIComponent(query)}`);

    if (!response.ok) {
        if (response.status === 404) {
            console.warn("No results found for:", query);
            return [];
        }
        throw new Error("Failed to fetch tokens");
    }

    return response.json();
};

export const fetchTokensByPalette = async (paletteId: string | undefined): Promise<Token[]> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/tokens/palette/${paletteId}`);
    if (!response.ok) {
        console.error(`Failed to fetch tokens for palette ${paletteId}`);
        throw new Error("Failed to fetch tokens");
    }
    return response.json();
};

export const updateTokenCount = async (tokenId: string, count: number): Promise<void> => {
    await fetch(`${VITE_APP_BACKEND_URL}/tokens/${tokenId}/count`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
    });
};

export const deleteToken = async (tokenId: string): Promise<void> => {
    await fetch(`${VITE_APP_BACKEND_URL}/tokens/${tokenId}`, {
        method: "DELETE",
    });
};

export const resetTokenCounts = async (paletteId: string): Promise<void> => {
    await fetch(`${VITE_APP_BACKEND_URL}/tokens/palette/${paletteId}/reset`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
};

