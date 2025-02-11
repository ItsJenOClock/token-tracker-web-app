package org.example.tokentrackerbackend.repositories;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.tokentrackerbackend.models.Token;
import org.example.tokentrackerbackend.models.TokenPalette;
import java.util.List;

@Transactional
public interface TokenRepository extends JpaRepository < Token, Long > {
    List < Token > findByTokenPalette(TokenPalette tokenPalette);

    List < Token > findByTokenPaletteId(Long paletteId);
}