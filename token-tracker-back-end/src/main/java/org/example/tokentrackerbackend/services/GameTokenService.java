package org.example.tokentrackerbackend.services;

import org.example.tokentrackerbackend.models.*;
import org.example.tokentrackerbackend.repositories.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.example.tokentrackerbackend.api.CardApiAccessor;
import org.example.tokentrackerbackend.api.CardTypeRecord;
import org.springframework.stereotype.Service;

@Service
public class GameTokenService {

    private final GameTokenRepository gameTokenRepository;
    private final GameInstanceRepository gameInstanceRepository;
    private final TokenTypeRepository tokenTypeRepository;
    private final ScryfallApiRepository scryfallApiRepository;
    private final CardApiAccessor cardApiAccessor;

    public GameTokenService(
            GameTokenRepository gameTokenRepository,
            GameInstanceRepository gameInstanceRepository,
            TokenTypeRepository tokenTypeRepository,
            ScryfallApiRepository scryfallApiRepository,
            CardApiAccessor cardApiAccessor
    ) {
        this.gameTokenRepository = gameTokenRepository;
        this.gameInstanceRepository = gameInstanceRepository;
        this.tokenTypeRepository = tokenTypeRepository;
        this.scryfallApiRepository = scryfallApiRepository;
        this.cardApiAccessor = cardApiAccessor;
    }
    public List < GameToken > getTokensForGame(Long gameId) {
        Optional < GameInstance > game = gameInstanceRepository.findById(gameId);
        return game.map(gameTokenRepository::findByGameInstance).orElseThrow(() - > new IllegalArgumentException("Game not found"));
    }

    public GameToken addTokenToGame(Long gameId, String oracleId, int side) {
        Optional < GameInstance > game = gameInstanceRepository.findById(gameId);
        if (game.isEmpty()) {
            throw new IllegalArgumentException("Game not found for ID: " + gameId);
        }

        System.out.println("Adding token to game: GameId=" + gameId + ", OracleId=" + oracleId + ", Side=" + side);
        ScryfallApi scryfallData = scryfallApiRepository.findByOracleIdAndSide(oracleId, side);

        if (scryfallData == null) {
            CardTypeRecord cardData = cardApiAccessor.getFullTokenList().stream()
                    .filter(card - > card.getOracleId().equals(oracleId) && card.getSide() == side)
                    .findFirst()
                    .orElse(null);

            if (cardData == null) {
                throw new IllegalArgumentException("Token data not found for provided oracleId and side.");
            }
            scryfallData = new ScryfallApi();
            scryfallData.setOracleId(cardData.getOracleId());
            scryfallData.setSide(cardData.getSide());
            scryfallData.setName(cardData.getName());
            scryfallData.setTypeLine(cardData.getTypeLine());
            scryfallData.setOracleText(cardData.getOracleText());
            scryfallData.setPower(cardData.getPower());
            scryfallData.setToughness(cardData.getToughness());
            scryfallData.setImageUri(cardData.getImageUri());
            scryfallData.setArtist(cardData.getArtist());
            scryfallData = scryfallApiRepository.save(scryfallData);
        }
        TokenType tokenType = tokenTypeRepository.findByScryfallApi(scryfallData);

        if (tokenType == null) {
            tokenType = new TokenType();
            tokenType.setName(scryfallData.getName());
            tokenType.setType(scryfallData.getTypeLine());
            tokenType.setText(scryfallData.getOracleText());
            tokenType.setArt(scryfallData.getImageUri());
            tokenType.setScryfallApi(scryfallData);
            tokenType = tokenTypeRepository.saveAndFlush(tokenType);
        }

        GameToken token = new GameToken();
        token.setGameInstance(game.get());
        token.setTokenType(tokenType);
        token.setSick(true);
        token.setTapped(false);
        token.setCounters(0);

        return gameTokenRepository.save(token);
    }

    public GameToken updateToken(Long tokenId, boolean isSick, boolean isTapped, int counters) {
        Optional < GameToken > token = gameTokenRepository.findById(tokenId);
        if (token.isEmpty()) {
            throw new IllegalArgumentException("Token not found");
        }

        GameToken gameToken = token.get();
        gameToken.setSick(isSick);
        gameToken.setTapped(isTapped);
        gameToken.setCounters(counters);

        return gameTokenRepository.save(gameToken);
    }

    public void removeToken(Long tokenId) {
        gameTokenRepository.deleteById(tokenId);
    }

    public void untapAllTokens(Long gameId) {
        List < GameToken > tokens = gameTokenRepository.findByGameInstanceId(gameId);
        for (GameToken token: tokens) {
            token.setTapped(false);
        }
        gameTokenRepository.saveAll(tokens);
    }
}