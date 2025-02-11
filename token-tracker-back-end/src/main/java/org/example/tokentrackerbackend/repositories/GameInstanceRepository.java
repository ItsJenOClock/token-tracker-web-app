package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.GameInstance;
import org.example.tokentrackerbackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameInstanceRepository extends JpaRepository < GameInstance, Long > {
    List < GameInstance > findByStatus(GameInstance.GameStatus status);
    List < GameInstance > findByOwnerAndStatus(User owner, GameInstance.GameStatus status);
    Optional < GameInstance > findFirstByOwnerAndStatus(User user, GameInstance.GameStatus gameStatus);
}