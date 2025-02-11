package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.models.GameInstance;
import org.example.tokentrackerbackend.services.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PatchMapping("/{id}/end")
    public ResponseEntity<GameInstance> endGame(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.endGame(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameInstance> getGameById(@PathVariable Long id) {
        return gameService.getGameById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{gameId}/start-next-turn")
    public ResponseEntity<Void> startNextTurn(@PathVariable Long gameId) {
        gameService.untapAllTokens(gameId);
        gameService.clearAllSickness(gameId);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<GameInstance> createGame(@RequestParam Long tokenPaletteId, @RequestHeader("Authorization") String username) {
        return ResponseEntity.ok(gameService.createGame(tokenPaletteId, username));
    }

    @GetMapping("/active")
    public ResponseEntity<GameInstance> getActiveGame(@RequestHeader("Authorization") String username) {
        return gameService.getActiveGameForUser(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}