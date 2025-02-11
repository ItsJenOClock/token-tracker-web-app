package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.models.Token;
import org.example.tokentrackerbackend.repositories.TokenRepository;
import org.example.tokentrackerbackend.repositories.TokenPaletteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/palette/{paletteId}")
    public ResponseEntity<List<Token>> getTokensByPalette(@PathVariable long paletteId) {
        return paletteRepository.findById(paletteId).map(palette ->
                ResponseEntity.ok(palette.getTokens())
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToken(@PathVariable long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}