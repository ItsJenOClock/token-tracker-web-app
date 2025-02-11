package org.example.tokentrackerbackend.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class TokenPalette {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "tokenPalette", cascade = CascadeType.ALL, orphanRemoval = true)
    private List < Token > tokens = new ArrayList < > ();

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

    public List < Token > getTokens() {
        return tokens;
    }

    public void setTokens(List < Token > tokens) {
        this.tokens = tokens;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

}