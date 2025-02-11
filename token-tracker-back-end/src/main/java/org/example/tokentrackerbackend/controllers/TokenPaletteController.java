package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.models.*;
import org.example.tokentrackerbackend.repositories.*;
import org.example.tokentrackerbackend.api.CardApiAccessor;
import org.example.tokentrackerbackend.api.CardTypeRecord;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/token_palettes")
public class TokenPaletteController {
    private final TokenPaletteRepository tokenPaletteRepository;
    private final TokenTypeRepository tokenTypeRepository;
    private final ScryfallApiRepository scryfallApiRepository;
    private final CardApiAccessor cardApiAccessor;
    private final UserRepository userRepository;

    public TokenPaletteController(
            TokenPaletteRepository tokenPaletteRepository,
            TokenTypeRepository tokenTypeRepository,
            ScryfallApiRepository scryfallApiRepository,
            CardApiAccessor cardApiAccessor,
            UserRepository userRepository) {
        this.tokenPaletteRepository = tokenPaletteRepository;
        this.tokenTypeRepository = tokenTypeRepository;
        this.scryfallApiRepository = scryfallApiRepository;
        this.cardApiAccessor = cardApiAccessor;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<TokenPalette>> getUserTokenPalettes(@RequestHeader("Authorization") String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(tokenPaletteRepository.findByOwner(user.get()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping
    public ResponseEntity<TokenPalette> createTokenPalette(@RequestHeader("Authorization") String username, @RequestBody TokenPalette tokenPalette) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            tokenPalette.setOwner(user.get());
            TokenPalette savedPalette = tokenPaletteRepository.save(tokenPalette);
            return ResponseEntity.ok(savedPalette);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/{id}/add_token")
    public ResponseEntity<TokenPalette> addTokenToPalette(
            @RequestHeader("Authorization") String username,
            @PathVariable Long id,
            @RequestParam String oracleId,
            @RequestParam int side) {

        Optional<User> user = userRepository.findByUsername(username);
        Optional<TokenPalette> palette = tokenPaletteRepository.findById(id);

        if (user.isPresent() && palette.isPresent() && palette.get().getOwner().equals(user.get())) {
            TokenPalette tokenPalette = palette.get();

            ScryfallApi scryfallData = scryfallApiRepository.findByOracleIdAndSide(oracleId, side);

            if (scryfallData == null) {
                CardTypeRecord cardData = cardApiAccessor.getFullTokenList().stream()
                        .filter(card -> card.getOracleId().equals(oracleId) && card.getSide() == side)
                        .findFirst()
                        .orElse(null);

                if (cardData == null) {
                    return ResponseEntity.notFound().build();
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

            Token token = new Token();
            token.setTokenPalette(tokenPalette);
            token.setTokenType(tokenType);
            tokenPalette.getTokens().add(token);
            tokenPaletteRepository.save(tokenPalette);
            return ResponseEntity.ok(tokenPalette);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TokenPalette> getTokenPaletteById(@RequestHeader("Authorization") String username, @PathVariable Long id) {
        Optional<User> user = userRepository.findByUsername(username);
        Optional<TokenPalette> palette = tokenPaletteRepository.findById(id);

        if (user.isPresent() && palette.isPresent() && palette.get().getOwner().equals(user.get())) {
            return ResponseEntity.ok(palette.get());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }

    @PatchMapping("/{id}/update_name")
    public ResponseEntity<TokenPalette> updateTokenPaletteName(
            @RequestHeader("Authorization") String username,
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody) {

        Optional<User> user = userRepository.findByUsername(username);
        Optional<TokenPalette> palette = tokenPaletteRepository.findById(id);

        if (user.isPresent() && palette.isPresent() && palette.get().getOwner().equals(user.get())) {
            TokenPalette tokenPalette = palette.get();
            String newName = requestBody.get("name");
            if (newName == null || newName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            tokenPalette.setName(newName);
            tokenPaletteRepository.save(tokenPalette);
            return ResponseEntity.ok(tokenPalette);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTokenPalette(
            @RequestHeader("Authorization") String username,
            @PathVariable Long id) {

        Optional<User> user = userRepository.findByUsername(username);
        Optional<TokenPalette> palette = tokenPaletteRepository.findById(id);
        if (user.isPresent() && palette.isPresent() && palette.get().getOwner().equals(user.get())) {
            tokenPaletteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}