package com.project.objects;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Entity
public class Enchere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.EAGER)
    private Pokemon pokemon;

    @ManyToOne(fetch = FetchType.EAGER)
    private Utilisateur enchereur;

    private double montant;

    private long startTime;

    private int durationMinutes;

    private boolean active;


        // Constructeur principal
        public Enchere(Utilisateur utilisateur, Pokemon pokemon, int durationMinutes, Integer montant) {
            this.utilisateur = utilisateur;
            this.pokemon = pokemon;
            this.montant = (montant != null) ? montant : calculateMontant();
            this.startTime = System.currentTimeMillis();
            this.durationMinutes = (durationMinutes > 0) ? durationMinutes : 60; // Par défaut 60 minutes
            this.active = true;
        }

        public Enchere(Utilisateur utilisateur, Pokemon pokemon, int durationMinutes) {
            this(utilisateur, pokemon, durationMinutes, null); // Par défaut montant calculé
        }

        public Enchere(Utilisateur utilisateur, Pokemon pokemon) {
            this(utilisateur, pokemon, 60, null); // Par défaut 60 minutes et montant calculé
        }

        public Enchere(Pokemon pokemon) {
            this(null, pokemon, 60, null); // Par défaut sans utilisateur, 60 minutes et montant calculé
        }



    public Enchere() {}

    public boolean isActive() {
        // Vérifie l'état actif en fonction du temps et du champ `active`
        if (active && (System.currentTimeMillis() - startTime < (long) durationMinutes * 60 * 1000)) {
            return true;
        } else {
            active = false; // Met à jour le statut si le temps est dépassé
            return false;

        }
    }

    public boolean getActiveBeforeTest() {
        return this.active;
    }

    public int calculateMontant() {
        return (int) (pokemon.getValeurReelle() * (1 + Math.random() * 0.8 - 0.4));
    }// Calcule un montant aléatoire pour l'enchere

    public void surencherir(Utilisateur user, int montant) {
        if (isActive() && montant > this.montant && user != utilisateur) {
            this.montant = montant;
            this.enchereur = user;
            this.startTime = System.currentTimeMillis(); // Prolonge l'enchère
            System.out.println(user.getUsername() + " surenchérit sur l'enchère de " + pokemon.getNom() + " avec un montant de " + montant);
        } else {
            System.out.println("L'enchère est terminée ou le montant est insuffisant");
        }
    }// Permet de surenchérir sur une enchère
}
