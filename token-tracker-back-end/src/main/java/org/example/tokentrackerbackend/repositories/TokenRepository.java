package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long> {
}
