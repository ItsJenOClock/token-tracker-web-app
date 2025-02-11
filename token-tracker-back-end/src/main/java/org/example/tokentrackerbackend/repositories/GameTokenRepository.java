package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.GameToken;
import org.example.tokentrackerbackend.models.GameInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameTokenRepository extends JpaRepository<GameToken, Long> {
    List<GameToken> findByGameInstance(GameInstance gameInstance);
    List<GameToken> findByGameInstanceId(Long gameId);
}