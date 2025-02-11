import {
    TokenSearchResult,
    TokenPaletteType,
    Token,
    GameToken,
    GameInstance,
    TokenDetails,
} from "../types/types";

const VITE_APP_BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const getAuthHeaders = (): Record<string, string> => {
    const user = localStorage.getItem("loggedInUser");
    return user
      ? {
          "Content-Type": "application/json",
          Authorization: user,
      }
      : {
          "Content-Type": "application/json",
      };
};
export const loginUser = async (
  username: string,
): Promise<{
    success: boolean;
    message?: string;
}> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/users/login`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            username,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("loggedInUser", data.username);
        return {
            success: true,
        };
    } else if (response.status === 404) {
        return {
            success: false,
            message: "Username does not exist. Want to create a username instead?",
        };
    } else {
        throw new Error("Failed to log in");
    }
};
export const createUser = async (username: string): Promise<void> => {
    try {
        const response = await fetch(`${VITE_APP_BACKEND_URL}/users/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create user");
        }
        localStorage.setItem("loggedInUser", username);
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};
export const fetchTokenPalettes = async (): Promise<TokenPaletteType[]> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/token_palettes`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        console.error("Failed to fetch token palettes, status:", response.status);
        throw new Error("Failed to fetch token palettes");
    }
    return response.json();
};
export const createTokenPalette = async (
  name: string,
): Promise<TokenPaletteType> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/token_palettes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            name,
        }),
    });
    return response.json();
};
export const addTokenToPalette = async (
  paletteId: string,
  oracleId: string,
  side: number,
): Promise<void> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/token_palettes/${paletteId}/add_token?oracleId=${oracleId}&side=${side}`,
      {
          method: "POST",
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(
          "Failed to add token, status:",
          response.status,
          "message:",
          errorMessage,
        );
        throw new Error(`Failed to add token: ${errorMessage}`);
    }
};
export const searchTokens = async (
  query: string,
): Promise<TokenSearchResult[]> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/token_types/search?name=${encodeURIComponent(query)}`,
      {
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        if (response.status === 404) {
            console.warn("No results found for:", query);
            return [];
        }
        throw new Error("Failed to fetch tokens");
    }
    return response.json();
};
export const fetchTokenDetails = async (
  oracleId: string,
  side: string | number,
): Promise<TokenDetails> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/token_types/by-oracleId/${oracleId}/${side}`,
      {
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch token details:", errorText);
        throw new Error("Token not found");
    }
    return response.json();
};
export const fetchTokensByPalette = async (
  paletteId: string | undefined,
): Promise<Token[]> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/tokens/palette/${paletteId}`,
      {
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        console.error(`Failed to fetch tokens for palette ${paletteId}`);
        throw new Error("Failed to fetch tokens");
    }
    return response.json();
};
export const deleteToken = async (tokenId: string): Promise<void> => {
    await fetch(`${VITE_APP_BACKEND_URL}/tokens/${tokenId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
};
export const fetchPaletteById = async (
  paletteId: string,
): Promise<TokenPaletteType> => {
    const url = `${VITE_APP_BACKEND_URL}/token_palettes/${paletteId}`;
    const response = await fetch(url, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to fetch palette ${paletteId}, Status: ${response.status}, Response: ${errorText}`,
        );
        throw new Error(`Failed to fetch token palette: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};
export const updateTokenPaletteName = async (
  paletteId: string,
  newName: string,
): Promise<void> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/token_palettes/${paletteId}/update_name`,
      {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
              name: newName,
          }),
      },
    );
    if (!response.ok) {
        throw new Error("Failed to update token palette name");
    }
};
export const fetchActiveGames = async (): Promise<GameInstance[]> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/games`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        console.error("Failed to fetch active games");
        throw new Error("Failed to fetch active games");
    }
    return response.json();
};
export const createGame = async (
  tokenPaletteId: string,
): Promise<GameInstance> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/games?tokenPaletteId=${tokenPaletteId}`,
      {
          method: "POST",
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        throw new Error("Failed to create game");
    }
    return response.json();
};
export const fetchGameInstance = async (
  gameId: string,
): Promise<GameInstance> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/games/${gameId}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        console.error(`Failed to fetch game instance, status: ${response.status}`);
        throw new Error("Failed to fetch game instance");
    }
    return response.json();
};
export const fetchGameTokens = async (gameId: string): Promise<GameToken[]> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/games/${gameId}/tokens`,
      {
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        throw new Error("Failed to fetch game tokens");
    }
    return response.json();
};
export const updateGameToken = async (
  gameId: string,
  tokenId: string,
  updates: Partial<GameToken>,
): Promise<GameToken> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/games/${gameId}/tokens/${tokenId}`,
      {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(updates),
      },
    );
    if (!response.ok) {
        throw new Error("Failed to update game token");
    }
    return response.json();
};
export const endGame = async (gameId: string): Promise<void> => {
    await fetch(`${VITE_APP_BACKEND_URL}/games/${gameId}/end`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
};
export const fetchCurrentGame = async () => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/games/active`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        console.error(
          `Failed to fetch current game: ${response.status} ${response.statusText}`,
        );
        throw new Error("Failed to fetch current game");
    }
    try {
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error parsing JSON response", err);
        throw new Error("Invalid JSON response from fetchCurrentGame");
    }
};
export const addTokenToCurrentGame = async (
  gameId: string,
  oracleId: string,
  side: number,
): Promise<GameToken> => {
    console.log("Calling addTokenToCurrentGame with gameId, oracleId, side:", {
        gameId,
        oracleId,
        side,
    });
    const identifyingPair = {
        oracleId: oracleId,
        side: side,
    };
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/games/${gameId}/tokens`,
      {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(identifyingPair),
      },
    );
    if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Failed to add token: ${errorResponse}`);
    }
    return response.json();
};
export const startNextTurn = async (gameId: string): Promise<void> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/games/${gameId}/start-next-turn`,
      {
          method: "PATCH",
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        throw new Error("Failed to start next turn");
    }
};
export const deleteGameToken = async (
  gameId: string,
  tokenId: string,
): Promise<void> => {
    const response = await fetch(
      `${VITE_APP_BACKEND_URL}/games/${gameId}/tokens/${tokenId}`,
      {
          method: "DELETE",
          headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
        throw new Error("Failed to delete token from game instance");
    }
};
export const deleteTokenPalette = async (id: string) => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/token_palettes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error("Failed to delete the token palette.");
    }
};
export const fetchAllPalettesApi = async (): Promise<TokenPaletteType[]> => {
    const response = await fetch(`${VITE_APP_BACKEND_URL}/token_palettes`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error("Failed to fetch all palettes");
    }
    return await response.json();
};
