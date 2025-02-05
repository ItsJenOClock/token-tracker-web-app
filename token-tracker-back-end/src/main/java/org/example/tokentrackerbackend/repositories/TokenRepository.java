package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
}