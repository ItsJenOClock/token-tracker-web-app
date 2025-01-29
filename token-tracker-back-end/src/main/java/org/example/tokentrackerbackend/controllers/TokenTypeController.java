package org.example.tokentrackerbackend.controllers;

import org.example.tokentrackerbackend.models.TokenType;
import org.example.tokentrackerbackend.repositories.TokenTypeRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/token_types")
public class TokenTypeController {

    private final TokenTypeRepository repository;

    public TokenTypeController(TokenTypeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TokenType> getAllTokenTypes() {
        return repository.findAll();
    }
}
