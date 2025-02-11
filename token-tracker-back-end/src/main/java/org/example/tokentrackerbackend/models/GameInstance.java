package org.example.tokentrackerbackend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class GameInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "token_palette_id", nullable = false)
    private TokenPalette tokenPalette;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "gameInstance", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("gameInstance")
    private List<GameToken> gameTokens;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private GameStatus status = GameStatus.ACTIVE;

    public enum GameStatus {
        ACTIVE, ENDED
    }

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

    public User getOwner() {
        return owner;
    }
    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<GameToken> getGameTokens() {
        return gameTokens;
    }

    public void setGameTokens(List<GameToken> gameTokens) {
        this.gameTokens = gameTokens;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }
}