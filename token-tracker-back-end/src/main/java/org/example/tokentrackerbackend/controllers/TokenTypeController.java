package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.api.CardApiAccessor;
import org.example.tokentrackerbackend.api.CardTypeRecord;
import org.example.tokentrackerbackend.models.*;
import org.example.tokentrackerbackend.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/token_types")
public class TokenTypeController {

    private final TokenTypeRepository tokenTypeRepository;
    private final ScryfallApiRepository scryfallApiRepository;
    private final CardApiAccessor cardApiAccessor;

    public TokenTypeController(TokenTypeRepository tokenTypeRepository, ScryfallApiRepository scryfallApiRepository, CardApiAccessor cardApiAccessor) {
        this.tokenTypeRepository = tokenTypeRepository;
        this.scryfallApiRepository = scryfallApiRepository;
        this.cardApiAccessor = cardApiAccessor;
    }

    @GetMapping("/search")
    public ResponseEntity < List < CardTypeRecord >> searchTokensByName(@RequestParam String name) {
        List < CardTypeRecord > allTokens = cardApiAccessor.getFullTokenList();

        List < CardTypeRecord > filteredTokens = allTokens.stream()
                .filter(token - > token.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());

        if (filteredTokens.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(filteredTokens);
    }

    @GetMapping("/by-oracleId/{oracleId}/{side}")
    public ResponseEntity < Map < String, Object >> getTokenTypeByOracleIdAndSide(@PathVariable String oracleId, @PathVariable int side) {
        ScryfallApi scryfallApi = scryfallApiRepository.findByOracleIdAndSide(oracleId, side);

        if (scryfallApi == null) {
            List < CardTypeRecord > allTokens = cardApiAccessor.getFullTokenList();
            for (CardTypeRecord card: allTokens) {
                if (card.getOracleId().equals(oracleId) && card.getSide() == side) {
                    Map < String, Object > response = new HashMap < > ();
                    response.put("oracleId", card.getOracleId());
                    response.put("side", card.getSide());
                    response.put("name", card.getName());
                    response.put("typeLine", card.getTypeLine());
                    response.put("oracleText", card.getOracleText() != null ? card.getOracleText() : "No text available");
                    response.put("power", card.getPower() != null ? card.getPower() : "N/A");
                    response.put("toughness", card.getToughness() != null ? card.getToughness() : "N/A");
                    response.put("imageUri", card.getImageUri());
                    response.put("artist", card.getArtist() != null ? card.getArtist() : "Unknown");
                    return ResponseEntity.ok(response);
                }
            }
            return ResponseEntity.notFound().build();
        }
        Map < String, Object > response = new HashMap < > ();
        response.put("oracleId", scryfallApi.getOracleId());
        response.put("side", scryfallApi.getSide());
        response.put("name", scryfallApi.getName());
        response.put("typeLine", scryfallApi.getTypeLine());
        response.put("oracleText", scryfallApi.getOracleText() != null ? scryfallApi.getOracleText() : "No text available");
        response.put("power", scryfallApi.getPower() != null ? scryfallApi.getPower() : "");
        response.put("toughness", scryfallApi.getToughness() != null ? scryfallApi.getToughness() : "");
        response.put("imageUri", scryfallApi.getImageUri());
        response.put("artist", scryfallApi.getArtist() != null ? scryfallApi.getArtist() : "Unknown");

        return ResponseEntity.ok(response);
    }
}