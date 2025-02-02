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
    count: number;
    tokenType: TokenType;
}