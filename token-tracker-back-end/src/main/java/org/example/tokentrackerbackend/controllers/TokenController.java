package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.models.Token;
import org.example.tokentrackerbackend.repositories.TokenPaletteRepository;
import org.example.tokentrackerbackend.repositories.TokenRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tokens")
public class TokenController {

    private final TokenRepository repository;
    private final TokenPaletteRepository paletteRepository;

    public TokenController(TokenRepository repository, TokenPaletteRepository paletteRepository) {
        this.repository = repository;
        this.paletteRepository = paletteRepository;
    }

    @GetMapping
    public List<Token> getAllTokens() {
        return repository.findAll();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Token> updateToken(@PathVariable long id, @RequestBody Token updatedToken) {
        return repository.findById(id).map(token -> {
            token.setTapped(updatedToken.getTapped());
            token.setSick(updatedToken.getSick());
            token.setCount(updatedToken.getCount());
            return ResponseEntity.ok(repository.save(token));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/palette/{paletteId}")
    public ResponseEntity<List<Token>> getTokensByPalette(@PathVariable long paletteId) {
        return paletteRepository.findById(paletteId).map(palette ->
                ResponseEntity.ok(palette.getTokens())
        ).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/count")
    public ResponseEntity<Token> updateTokenCount(@PathVariable long id, @RequestBody int count) {
        return repository.findById(id).map(token -> {
            token.setCount(count);
            return ResponseEntity.ok(repository.save(token));
        }).orElse(ResponseEntity.notFound().build());
    }
}