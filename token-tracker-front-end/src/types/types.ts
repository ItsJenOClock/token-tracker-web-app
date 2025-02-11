export interface TokenSearchResult {
    oracleId: string;
    side: number;
    name: string;
    typeLine: string;
    oracleText?: string;
    power?: string;
    toughness?: string;
    imageUri?: string;
    artist?: string;
}
export interface TokenType {
    oracleId: string;
    side: number;
    name: string;
    type?: string;
    oracleText?: string;
    power?: string;
    toughness?: string;
    art?: string;
    artist?: string;
}
export interface TokenPaletteType {
    id: string;
    name: string;
    tokens: TokenType[];
}
export interface Token {
    id: string;
    name: string;
    tokenType: TokenType;
}
export interface GameInstance {
    id: string;
    tokenPalette: TokenPaletteType;
    createdAt: string;
    updatedAt: string;
    status: "ACTIVE" | "ENDED";
}
export interface GameToken {
    id: string;
    gameInstance: GameInstance;
    tokenType: TokenType;
    isSick: boolean;
    isTapped: boolean;
    counters: number;
}
export interface TokenIdentifyingPair {
    oracleId: string;
    side: number;
}
export interface TokenDetails {
    oracleId: string;
    side: number;
    name: string;
    typeLine: string;
    oracleText?: string;
    power?: string;
    toughness?: string;
    imageUri?: string;
    artist?: string;
}
