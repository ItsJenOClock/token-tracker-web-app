package org.example.tokentrackerbackend.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "scryfall_api")
public class ScryfallApi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String oracleId;
    private int side;
    private String name;
    private String typeLine;
    private String oracleText;
    private String power;
    private String toughness;
    private String imageUri;
    private String artist;

    @OneToMany(mappedBy = "scryfallApi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TokenType> tokenTypes;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOracleId() {
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTypeLine() {
        return typeLine;
    }

    public void setTypeLine(String typeLine) {
        this.typeLine = typeLine;
    }

    public String getOracleText() {
        return oracleText;
    }

    public void setOracleText(String oracleText) {
        this.oracleText = oracleText;
    }

    public String getPower() {
        return power;
    }

    public void setPower(String power) {
        this.power = power;
    }

    public String getToughness() {
        return toughness;
    }

    public void setToughness(String toughness) {
        this.toughness = toughness;
    }

    public String getImageUri() {
        return imageUri;
    }

    public void setImageUri(String imageUri) {
        this.imageUri = imageUri;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public List<TokenType> getTokenTypes() {
        return tokenTypes;
    }

    public void setTokenTypes(List<TokenType> tokenTypes) {
        this.tokenTypes = tokenTypes;
    }
}
