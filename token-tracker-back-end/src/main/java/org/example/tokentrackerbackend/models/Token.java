package org.example.tokentrackerbackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "token_palette_id")
    @JsonIgnore
    private TokenPalette tokenPalette;

    @ManyToOne
    @JoinColumn(name = "token_type_id", nullable = false)
    private TokenType tokenType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public TokenPalette getTokenPalette() {
        return tokenPalette;
    }

    public void setTokenPalette(TokenPalette tokenPalette) {
        this.tokenPalette = tokenPalette;
    }

    public TokenType getTokenType() {
        return tokenType;
    }

    public void setTokenType(TokenType tokenType) {
        this.tokenType = tokenType;
    }
}