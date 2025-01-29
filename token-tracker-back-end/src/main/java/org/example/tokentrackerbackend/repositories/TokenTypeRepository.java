package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenTypeRepository extends JpaRepository<TokenType, Long> {
}
