package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.ScryfallApi;
import org.example.tokentrackerbackend.models.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenTypeRepository extends JpaRepository<TokenType, Long> {
    TokenType findByScryfallApi(ScryfallApi scryfallApi);
}