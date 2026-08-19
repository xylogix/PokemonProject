package com.project.objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@ToString
public class Utilisateur {

    @Id
    private String username;
    private String password;
    private int wallet;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.PERSIST, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderColumn(name = "enchere_order") // Colonne pour gérer l'ordre
    private List<Enchere> encheres = new ArrayList<>();

    @JsonIgnore
    @OneToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @OrderColumn(name = "pokemon_order")
    private List<Pokemon> pokemons = new ArrayList<>();


    public Utilisateur() {}

    // Constructeur principal
    public Utilisateur(String username,String password) {
        this.username = username;
        this.password = password;
        this.wallet = 1000;

    }

    public void addEnchere(Enchere enchere) {
        encheres.add(enchere);
    }

    public void addPokemon(Pokemon pokemon) {
        if (!this.pokemons.contains(pokemon)) {
            this.pokemons.add(pokemon);
        } else {
            throw new IllegalArgumentException("Ce Pokémon est déjà associé à l'utilisateur.");
        }
    }// Ajoute un pokémon à sa liste de pokémons
}
