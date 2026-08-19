package com.project.services;

import com.project.objects.Enchere;
import com.project.objects.Pokemon;
import com.project.objects.Utilisateur;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;

@ApplicationScoped
public class UtilisateurService {

    @Inject
    EntityManager em;

    @Inject
    EnchereService enchereService;

    @Inject
    PokemonService pokemonService;

    @Transactional
    public void createUser(String username, String password) {
        String HashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        em.persist(new Utilisateur(username, HashedPassword));
    }// Permet de créer un utilisateur

    public boolean checkUser(String username, String password) {
        Utilisateur utilisateur = em.find(Utilisateur.class, username);
        if (utilisateur == null) {
            return false;
        }
        return BCrypt.checkpw(password, utilisateur.getPassword());
    }// Permet de vérifier si le mot de passe est correct

    @Transactional
    public List<Utilisateur> obtenirUserList() {
        return em.createQuery(
                        "SELECT u FROM Utilisateur u " +
                                "LEFT JOIN FETCH u.pokemons " +
                                "LEFT JOIN FETCH u.encheres", Utilisateur.class)
                .getResultList();
    }// Permet de récupérer tous les utilisateurs

    @Transactional
    public Utilisateur obtenirUserByName(String username) {
        return em.createQuery(
                        "SELECT u FROM Utilisateur u " +
                                "LEFT JOIN FETCH u.pokemons " +
                                "LEFT JOIN FETCH u.encheres " +
                                "WHERE u.username = :username", Utilisateur.class)
                .setParameter("username", username)
                .getSingleResult();
    }// Permet de récupérer un utilisateur par son nom


    @Transactional
    public void supprimerUtilisateur(String username) {
        Utilisateur utilisateur = em.find(Utilisateur.class, username);
        if (utilisateur != null) {
            em.remove(utilisateur);
        }
    }// Permet de supprimer un utilisateur

    @Transactional
    public List<Pokemon> obtenirPokemonListByUser(String username) {
        Utilisateur utilisateur = obtenirUserByName(username);
        return utilisateur.getPokemons();
    }// Permet de récupérer les pokémons d'un utilisateur

    @Transactional
    public void givePokemon(String username, Long id) {
        Utilisateur utilisateur = obtenirUserByName(username);
        Pokemon pokemon = em.find(Pokemon.class, id);
        utilisateur.addPokemon(pokemon);
        em.merge(utilisateur);
    }// Permet de donner un pokémon à un utilisateur

    @Transactional
    public void giveRandomPokemon(String username) {
        Utilisateur utilisateur = obtenirUserByName(username);
        Pokemon randomPokemon = pokemonService.getRandomPokemon();
        utilisateur.addPokemon(randomPokemon);
        em.merge(utilisateur);
    }// Permet de donner un pokémon aléatoire à un utilisateur

    @Transactional
    public void mettreAuxEncheres(String username, Long id, int montant, int duree) {
        Utilisateur utilisateur = obtenirUserByName(username);
        Pokemon pokemon = em.find(Pokemon.class, id);

        if (pokemon == null) {
            throw new IllegalArgumentException("Le Pokémon avec l'ID spécifié n'existe pas.");
        }

        if (!utilisateur.getPokemons().contains(pokemon)) {
            throw new IllegalArgumentException("Le Pokémon n'appartient pas à l'utilisateur.");
        }

        // Créer une nouvelle enchère et mettre à jour les relations
        Enchere enchere = new Enchere(utilisateur, pokemon, duree, montant);
        utilisateur.getPokemons().remove(pokemon);
        utilisateur.addEnchere(enchere);

        // Synchroniser les modifications
        em.merge(utilisateur);
        enchereService.saveEnchere(enchere);
    }// Permet de mettre un pokémon aux enchères

    @Transactional
    public int setWallet(String username, int value) {
        Utilisateur user = obtenirUserByName(username);
        if (user.getWallet() + value < 0) {
            return -1;
        }
        user.setWallet(user.getWallet() + value);
        System.out.println("deplacement de " + value + " de la bourse de " + username);
        em.merge(user);
        return 0;
    }// Permet d'ajuster le wallet d'un utilisateur

    @Transactional
    public List<Utilisateur> getTopUsers() {
        return em.createQuery(
                        "SELECT u FROM Utilisateur u " +
                                "LEFT JOIN FETCH u.pokemons " +
                                "LEFT JOIN FETCH u.encheres " +
                                "ORDER BY u.wallet DESC", Utilisateur.class)
                .setMaxResults(10)
                .getResultList();
    }// Permet de récupérer les 10 meilleurs utilisateurs

    @Transactional
    public void sellPokemon(Long id) {
        Enchere enchere = enchereService.getEnchereById(id);
        Utilisateur enchereur = enchere.getEnchereur();
        Pokemon pokemon = enchere.getPokemon();
        enchereur.getPokemons().remove(pokemon);
        enchere.getUtilisateur().setWallet((int) enchere.getMontant());
        enchereur.setWallet((int) (enchereur.getWallet() + (pokemon.getValeurReelle() - enchere.getMontant())));
        em.merge(enchereur);
    }// Permet de vendre un pokémon


}
