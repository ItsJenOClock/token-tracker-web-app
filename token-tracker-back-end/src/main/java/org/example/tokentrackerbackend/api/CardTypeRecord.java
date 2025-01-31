package org.example.tokentrackerbackend.api;

public class CardTypeRecord {

    private String oracleId;
    private int side;
    private String name;
    private String typeLine;
    private String oracleText;
    private String power;
    private String toughness;
    private String imageUri;
    private String artist;

    public CardTypeRecord(String oracleId, int side, String name, String typeLine, String oracleText, String power, String toughness, String imageUri, String artist) {
        this.oracleId = oracleId;
        this.side = side;
        this.name = name;
        this.typeLine = typeLine;
        this.oracleText = oracleText;
        this.power = power;
        this.toughness = toughness;
        this.imageUri = imageUri;
        this.artist = artist;
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
}