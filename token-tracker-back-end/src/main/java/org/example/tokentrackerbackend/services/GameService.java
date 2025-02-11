package org.example.tokentrackerbackend.services;

import org.example.tokentrackerbackend.models.GameInstance;
import org.example.tokentrackerbackend.models.TokenPalette;
import org.example.tokentrackerbackend.models.User;
import org.example.tokentrackerbackend.repositories.GameInstanceRepository;
import org.example.tokentrackerbackend.repositories.GameTokenRepository;
import org.example.tokentrackerbackend.repositories.TokenPaletteRepository;
import org.example.tokentrackerbackend.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameService {

    private final GameInstanceRepository gameInstanceRepository;
    private final GameTokenRepository gameTokenRepository;
    private final TokenPaletteRepository tokenPaletteRepository;
    private final UserRepository userRepository;

    public GameService(GameInstanceRepository gameInstanceRepository,
                       GameTokenRepository gameTokenRepository,
                       TokenPaletteRepository tokenPaletteRepository,
                       UserRepository userRepository) {
        this.gameInstanceRepository = gameInstanceRepository;
        this.gameTokenRepository = gameTokenRepository;
        this.tokenPaletteRepository = tokenPaletteRepository;
        this.userRepository = userRepository;
    }

    public GameInstance createGame(Long tokenPaletteId, String username) {
        TokenPalette tokenPalette = tokenPaletteRepository.findById(tokenPaletteId)
                .orElseThrow(() -> new RuntimeException("TokenPalette not found"));

        if (!tokenPalette.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("You do not have permission to use this palette.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<GameInstance> activeGame = gameInstanceRepository.findFirstByOwnerAndStatus(user, GameInstance.GameStatus.ACTIVE);
        if (activeGame.isPresent()) {
            throw new RuntimeException("You already have an active game. Starting a new game will end the current one.");
        }

        GameInstance game = new GameInstance();
        game.setTokenPalette(tokenPalette);
        game.setOwner(user);
        game.setStatus(GameInstance.GameStatus.ACTIVE);
        game = gameInstanceRepository.save(game);

        GameInstance finalGame = game;
        return gameInstanceRepository.save(game);
    }

    public Optional<GameInstance> getActiveGameForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return gameInstanceRepository.findFirstByOwnerAndStatus(user, GameInstance.GameStatus.ACTIVE);
    }

    public GameInstance endGame(Long gameId) {
        GameInstance game = gameInstanceRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        game.setStatus(GameInstance.GameStatus.ENDED);
        return gameInstanceRepository.save(game);
    }

    public Optional<GameInstance> getGameById(Long id) {
        return gameInstanceRepository.findById(id);
    }

    public void untapAllTokens(Long gameId) {
        var tokens = gameTokenRepository.findByGameInstanceId(gameId);
        for (var token : tokens) {
            token.setTapped(false);
        }
        gameTokenRepository.saveAll(tokens);
    }

    public void clearAllSickness(Long gameId) {
        var tokens = gameTokenRepository.findByGameInstanceId(gameId);
        for (var token : tokens) {
            token.setSick(false);
        }
        gameTokenRepository.saveAll(tokens);
    }
}