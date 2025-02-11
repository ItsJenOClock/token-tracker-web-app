package org.example.tokentrackerbackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class TokenType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String text;
    private String art;
    private String oracleId;
    private int side;

    @ManyToOne
    @JoinColumn(name = "scryfall_api_id", nullable = false)
    @JsonIgnore
    private ScryfallApi scryfallApi;


    @JsonIgnore
    @OneToMany(mappedBy = "tokenType", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Token> tokens;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getArt() {
        return art;
    }

    public void setArt(String art) {
        this.art = art;
    }


    public String getOracleId() {
        if (oracleId == null && scryfallApi != null) {
            return scryfallApi.getOracleId();
        }
        return oracleId;
    }

    public void setOracleId(String oracleId) {
        this.oracleId = oracleId;
    }

    public int getSide() {
        return side;
    }
    public void setSide(int side) {
        this.side = side;
    }

    public ScryfallApi getScryfallApi() {
        return scryfallApi;
    }

    public void setScryfallApi(ScryfallApi scryfallApi) {
        this.scryfallApi = scryfallApi;
    }

    public List<Token> getTokens() {
        return tokens;
    }
}