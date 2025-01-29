package org.example.tokentrackerbackend.models;

import jakarta.persistence.*;

@Entity
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isTapped;
    private boolean isSick;
    private int count;

    @ManyToOne
    @JoinColumn(name = "token_palette_id")
    private TokenPalette tokenPalette;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean getTapped() {
        return isTapped;
    }

    public void setTapped(boolean tapped) {
        isTapped = tapped;
    }

    public boolean getSick() {
        return isSick;
    }

    public void setSick(boolean sick) {
        isSick = sick;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public TokenPalette getTokenPalette() {
        return tokenPalette;
    }

    public void setTokenPalette(TokenPalette tokenPalette) {
        this.tokenPalette = tokenPalette;
    }
}