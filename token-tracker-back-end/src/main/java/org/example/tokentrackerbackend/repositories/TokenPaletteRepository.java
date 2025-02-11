package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.TokenPalette;
import org.example.tokentrackerbackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TokenPaletteRepository extends JpaRepository<TokenPalette, Long> {
    List<TokenPalette> findByOwner(User owner);
}