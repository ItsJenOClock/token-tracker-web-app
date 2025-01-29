package org.example.tokentrackerbackend.models;

import jakarta.persistence.*;

@Entity
public class TokenType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String text;
    private String color;
    private String art;

    @ManyToOne
    @JoinColumn(name = "scryfall_api_id", nullable = false)
    private ScryfallApi scryfallApi;

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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getArt() {
        return art;
    }

    public void setArt(String art) {
        this.art = art;
    }

    public ScryfallApi getScryfallApi() {
        return scryfallApi;
    }

    public void setScryfallApi(ScryfallApi scryfallApi) {
        this.scryfallApi = scryfallApi;
    }
}
