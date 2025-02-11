package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.TokenIdentifyingPair;
import org.example.tokentrackerbackend.models.GameToken;
import org.example.tokentrackerbackend.services.GameTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games/{gameId}/tokens")
public class GameTokenController {

    private final GameTokenService gameTokenService;

    public GameTokenController(GameTokenService gameTokenService) {
        this.gameTokenService = gameTokenService;
    }

    @GetMapping
    public ResponseEntity<List<GameToken>> getTokensForGame(@PathVariable Long gameId) {
        return ResponseEntity.ok(gameTokenService.getTokensForGame(gameId));
    }

    @PostMapping
    public ResponseEntity<GameToken> addTokenToGame(
            @PathVariable Long gameId,
            @RequestBody TokenIdentifyingPair tokenIdentifyingPair) {
        return ResponseEntity.ok(gameTokenService.addTokenToGame(gameId, tokenIdentifyingPair.oracleId(), tokenIdentifyingPair.side()));
    }
    @PatchMapping("/{tokenId}")
    public ResponseEntity<GameToken> updateToken(@PathVariable Long tokenId, @RequestBody Map<String, Object> updates) {
        boolean isSick = (boolean) updates.getOrDefault("isSick", true);
        boolean isTapped = (boolean) updates.getOrDefault("isTapped", false);
        int counters = (int) updates.getOrDefault("counters", 0);
        return ResponseEntity.ok(gameTokenService.updateToken(tokenId, isSick, isTapped, counters));
    }

    @DeleteMapping("/{tokenId}")
    public ResponseEntity<Void> removeToken(@PathVariable Long tokenId) {
        gameTokenService.removeToken(tokenId);
        return ResponseEntity.noContent().build();
    }

}