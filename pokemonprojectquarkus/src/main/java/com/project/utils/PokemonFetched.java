package com.project.utils;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PokemonFetched {
    private Name name; // Classe imbriquée pour mapper la section "name"
    private Sprites sprites; // Classe imbriquée pour mapper la section "sprites"
    private int pokedex_id;
    private int generation;
    private int catch_rate;
    private List<Type> types; // Utilisation d'une liste pour mapper le tableau "types"
    private Stats stats;

    @Getter
    @Setter
    public static class Name {
        private String fr; // Correspond au champ "fr" dans "name"
    }

    @Getter
    @Setter
    public static class Sprites {
        private String regular;
    }

    @Getter
    @Setter
    public static class Type {
        private String name;
        private String image;
    }
}
