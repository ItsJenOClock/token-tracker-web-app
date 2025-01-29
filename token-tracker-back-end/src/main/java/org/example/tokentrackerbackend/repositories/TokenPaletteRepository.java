package org.example.tokentrackerbackend.repositories;

import org.example.tokentrackerbackend.models.TokenPalette;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenPaletteRepository extends JpaRepository<TokenPalette, Long> {
}
