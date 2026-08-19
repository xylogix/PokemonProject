package com.project.objects;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.utils.PokemonFetched;
import com.project.utils.Stats;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
public class Pokemon {


    @Id // Identifiant unique autocréé
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nom;

    // chemin vers l'image du sprite
    private String sprite;

    @Column(nullable = false)
    private String type1;
    private String type2;

    @Embedded
    Stats stats;

    private int catch_rate;
    private long trainingStart;
    private int valeurReelle;

    @JsonIgnore
    @OneToMany(mappedBy = "pokemon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Enchere> historiqueEncheres = new ArrayList<>();


    public Pokemon() {}

    // Constructeur principal
    public Pokemon(PokemonFetched pkm) {
        this.nom = pkm.getName().getFr();
        this.type1 = pkm.getTypes().get(0).getName();
        this.type2 = pkm.getTypes().size() >= 2 ? pkm.getTypes().get(1).getName() : null;
        this.sprite = pkm.getSprites().getRegular();
        this.stats = pkm.getStats();
        this.valeurReelle = generateValeurReelle(pkm);
        this.catch_rate = pkm.getCatch_rate();
    }

    private int generateValeurReelle(PokemonFetched pkm) {
        return (stats.somme()/6 * (256 - pkm.getCatch_rate()))/10;
    }// Calcul la valeur réelle du pokémon

    public void ajouterEnchere(Enchere enchere) {
        this.historiqueEncheres.add(enchere);
    }// Ajoute une enchère à l'historique

    public void updateValeurReelle() {
        this.valeurReelle = (stats.somme()/6 * (256 - catch_rate))/10;
    }// Met à jour la valeur réelle du pokémon
}
