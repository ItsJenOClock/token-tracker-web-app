package org.example.tokentrackerbackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
public class GameToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_instance_id", nullable = false)
    @JsonIgnore
    private GameInstance gameInstance;

    @ManyToOne
    @JoinColumn(name = "token_type_id", nullable = false)
    private TokenType tokenType;

    @JsonProperty("isTapped")
    private boolean isTapped = false;

    @JsonProperty("isSick")
    private boolean isSick = true;

    private int counters = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GameInstance getGameInstance() {
        return gameInstance;
    }

    public void setGameInstance(GameInstance gameInstance) {
        this.gameInstance = gameInstance;
    }

    public TokenType getTokenType() {
        return tokenType;
    }

    public void setTokenType(TokenType tokenType) {
        this.tokenType = tokenType;
    }

    public boolean isTapped() {
        return isTapped;
    }

    public void setTapped(boolean tapped) {
        isTapped = tapped;
    }

    public boolean isSick() {
        return isSick;
    }

    public void setSick(boolean sick) {
        isSick = sick;
    }

    public int getCounters() {
        return counters;
    }

    public void setCounters(int counters) {
        this.counters = counters;
    }
}