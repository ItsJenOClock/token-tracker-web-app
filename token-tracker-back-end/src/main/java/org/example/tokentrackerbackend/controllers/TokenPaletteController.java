package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.models.Token;
import org.example.tokentrackerbackend.models.TokenPalette;
import org.example.tokentrackerbackend.repositories.TokenPaletteRepository;
import org.example.tokentrackerbackend.repositories.TokenRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/token_palettes")
public class TokenPaletteController {

    private final TokenPaletteRepository repository;
    private final TokenRepository tokenRepository;

    public TokenPaletteController(TokenPaletteRepository repository, TokenRepository tokenRepository) {
        this.repository = repository;
        this.tokenRepository = tokenRepository;
    }

    @GetMapping
    public List<TokenPalette> getAllTokenPalettes() {
        return repository.findAll();
    }

    @PostMapping
    public TokenPalette createTokenPalette(@RequestBody TokenPalette tokenPalette) {
        return repository.save(tokenPalette);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TokenPalette> updateTokenPalette(@PathVariable long id, @RequestBody TokenPalette updatedPalette) {
        return repository.findById(id).map(palette -> {
            palette.setName(updatedPalette.getName());
            return ResponseEntity.ok(repository.save(palette));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTokenPalette(@PathVariable long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/tokens")
    public ResponseEntity<TokenPalette> addTokensToPalette(@PathVariable long id, @RequestBody List<Long> tokenIds) {
        return repository.findById(id).map(palette -> {
            List<Token> tokens = tokenRepository.findAllById(tokenIds);
            palette.getTokens().addAll(tokens);
            return ResponseEntity.ok(repository.save(palette));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/tokens/{tokenId}")
    public ResponseEntity<TokenPalette> removeTokenFromPalette(@PathVariable long id, @PathVariable long tokenId) {
        return repository.findById(id).map(palette -> {
            palette.getTokens().removeIf(token -> token.getId() == tokenId);
            return ResponseEntity.ok(repository.save(palette));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/reset")
    public ResponseEntity<TokenPalette> resetTokenCounts(@PathVariable long id) {
        return repository.findById(id).map(palette -> {
            palette.getTokens().forEach(token -> token.setCount(0));
            tokenRepository.saveAll(palette.getTokens());
            return ResponseEntity.ok(repository.save(palette));
        }).orElse(ResponseEntity.notFound().build());
    }
}