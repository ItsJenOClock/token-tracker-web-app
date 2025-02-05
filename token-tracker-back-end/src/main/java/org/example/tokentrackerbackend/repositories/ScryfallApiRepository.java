package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.ScryfallApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScryfallApiRepository extends JpaRepository<ScryfallApi, Integer> {
    List<ScryfallApi> findByName(String name);
    ScryfallApi findByOracleIdAndSide(String oracleId, int side);
}