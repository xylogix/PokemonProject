package com.project.services;

import com.project.utils.NotificationSocket;
import com.project.objects.Enchere;
import com.project.objects.Pokemon;
import com.project.objects.Utilisateur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import io.quarkus.scheduler.Scheduled;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class EnchereService {

    @Inject
    EntityManager em;

    @Inject
    PokemonService pokemonService;

    @Transactional
    public void createRandomEnchere() {
        Pokemon randomPokemon = pokemonService.getRandomPokemon();
        Enchere enchere = new Enchere(null, randomPokemon, 10 + (int) (Math.random() * 20));
        saveEnchere(enchere);
    }// Permet de créer une enchère aléatoire

    @Transactional
    public void createEnchere(String username, Long pokemonId, int duree, int montant) {
        Utilisateur utilisateur = em.find(Utilisateur.class, username);
        Pokemon pokemon = em.find(Pokemon.class, pokemonId);
        Enchere enchere = new Enchere(utilisateur, pokemon, duree, montant);
        saveEnchere(enchere);
        saveEnchereInPokemon(enchere);
    }// Permet de créer une enchère

    @Transactional
    public Enchere saveEnchere(Enchere enchere) {
        em.persist(enchere);
        return enchere;
    }// Permet de sauvegarder une enchère

    @Transactional
    public Enchere getEnchereById(Long id) {
        return em.createQuery(
                        "SELECT e FROM Enchere e " +
                                "JOIN FETCH e.pokemon " +
                                "LEFT JOIN FETCH e.utilisateur " +
                                "WHERE e.id = :id", Enchere.class)
                .setParameter("id", id)
                .getSingleResult();
    }// Permet de récupérer une enchère par son id

    @Transactional
    public void saveEnchereInPokemon(Enchere enchere) {
        enchere.getPokemon().ajouterEnchere(enchere);
        em.merge(enchere.getPokemon());
    }// Permet de sauvegarder une enchère dans un pokémon

    @Scheduled(every = "10s")
    void reassortStock() throws IOException {
        System.out.println("Reassorting stock...");
        updateEncheres();
        while (getEncheresActives().size() < 5) {
            createRandomEnchere();
        }
    }// Permet d'update les enchères et de créer des enchères aléatoires si on en a moins de 5

    @Transactional
    public void updateEncheres() {
        List<Enchere> encheres = obtenirEnchereList();
        for (Enchere enchere : encheres) {
            //on update seulement son etat s'il n'est pas actif
            if (enchere.getActiveBeforeTest()) {
                if (!enchere.isActive() && enchere.getUtilisateur() != null && enchere.getEnchereur() != null) {
                    enchere.setActive(false);
                    em.merge(enchere);
                    String username = enchere.getUtilisateur().getUsername();

                    NotificationSocket.sendToUser(
                            username,
                            "Votre enchère sur le Pokémon " + enchere.getPokemon().getNom() + " est terminée."
                    );

                    if (enchere.getEnchereur() != null) {
                        String enchereur = enchere.getEnchereur().getUsername();

                        NotificationSocket.sendToUser(
                                enchereur,
                                "L'enchère sur le Pokémon " + enchere.getPokemon().getNom() + " est terminée."
                        );
                    }
                } else if (!enchere.isActive() && enchere.getUtilisateur() == null && enchere.getEnchereur() == null) {

                    em.remove(enchere);

                } else if (!enchere.isActive() && enchere.getUtilisateur() != null && enchere.getEnchereur() == null) {
                    Pokemon pokemon = enchere.getPokemon();
                    enchere.getUtilisateur().addPokemon(pokemon);
                    em.merge(enchere.getUtilisateur());
                    em.remove(enchere);

                    NotificationSocket.sendToUser(
                            enchere.getUtilisateur().getUsername(),
                            "Votre enchère sur le Pokémon " + pokemon.getNom() + " est terminée et n'a pas eu d'enchèreur."
                    );
                }
            }
        }
    }// Permet de mettre à jour les enchères

    @Transactional
    public List<Enchere> getEncheresEnCoursByUser(String username) {
        return em.createQuery(
                        "SELECT e FROM Enchere e " +
                                "JOIN FETCH e.pokemon " +
                                "LEFT JOIN FETCH e.utilisateur " +
                                "WHERE e.utilisateur.username = :username OR e.enchereur.username = :username", Enchere.class)
                .setParameter("username", username)
                .getResultList();
    }// Permet de récupérer les enchères d'un utilisateur


    @Transactional
    public List<Enchere> obtenirEnchereList() {
        return em.createQuery(
                        "SELECT e FROM Enchere e " +
                                "JOIN FETCH e.pokemon " +
                                "LEFT JOIN FETCH e.utilisateur", Enchere.class)
                .getResultList();
    }// Permet de récupérer toutes les enchères

    @Transactional
    public void supprimerEnchere(long id) {
        Enchere enchere = getEnchereById(id);
        if (enchere != null) {
            em.remove(enchere);
        }
    }// Permet de supprimer une enchère

    @Transactional
    public int surencherir(Long id, String username, int montant) {
        Enchere enchere = getEnchereById(id);
        if (enchere.getEnchereur() != null){
            NotificationSocket.sendToUser(
                    enchere.getEnchereur().getUsername(),
                    "Vous avez été surenchéri sur le Pokémon " + enchere.getPokemon().getNom() + " !"
            );
        }

        Utilisateur utilisateur = em.find(Utilisateur.class, username);
        if (enchere != null && utilisateur != null && montant > enchere.getMontant()) {
            enchere.surencherir(utilisateur, montant);
            em.merge(enchere);
            return montant;
        }
        return -1;
    }// Permet de surenchérir sur une enchère

    public Enchere getRandomEnchere() {
        List<Enchere> encheres = getEncheresActives();
        return encheres.get((int) (Math.random() * encheres.size()));
    }// Permet de récupérer une enchère aléatoire


    public List<Enchere> getRandomEncheres(int n) {
        List<Enchere> encheres = getEncheresActives();
        List<Enchere> randomEncheres = new ArrayList<>();
        while (randomEncheres.size() < n && randomEncheres.size() < encheres.size()) {
            Enchere randomEnchere = encheres.get((int) (Math.random() * encheres.size()));
            if (!randomEncheres.contains(randomEnchere)) {
                randomEncheres.add(randomEnchere);
            }
        }
        return randomEncheres;
    }// Permet de récupérer plusieurs enchères aléatoires

    public List<Enchere> getEncheresActives() {
        return em.createQuery(
                        "SELECT e FROM Enchere e " +
                                "JOIN FETCH e.pokemon " +
                                "LEFT JOIN FETCH e.utilisateur " +
                                "WHERE e.active = true", Enchere.class)
                .getResultList();
    }// Permet de récupérer toutes les enchères actives

    @Transactional
    public int accepterEnchere(Long id) {
        Enchere enchere = getEnchereById(id);
        if (enchere != null) {
            Utilisateur enchereur = enchere.getEnchereur();
            if (enchereur.getWallet() < enchere.getMontant()) {
                return -1;
            } else {
                if (enchere.getUtilisateur() != null)
                    enchere.getUtilisateur().setWallet((int) (enchere.getUtilisateur().getWallet() + enchere.getMontant()));

                enchereur.setWallet((int) (enchereur.getWallet() - enchere.getMontant()));
                enchereur.addPokemon(enchere.getPokemon());
                em.merge(enchere.getPokemon());
                em.merge(enchereur);
                em.remove(enchere);
            }
        }
        return 0;
    }// Permet d'accepter une enchère

    @Transactional
    public void refuserEnchere(Long id) {
        Enchere enchere = getEnchereById(id);
        if (enchere != null) {
            if (enchere.getUtilisateur() == null) {
                em.remove(enchere);
            } else {
                Utilisateur utilisateur = enchere.getUtilisateur();
                utilisateur.addPokemon(enchere.getPokemon());
                em.merge(utilisateur);
                em.remove(enchere);
            }
        }
    }// Permet de refuser une enchère
}