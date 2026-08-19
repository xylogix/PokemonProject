package com.project.services;

import com.google.gson.Gson;
import com.project.utils.ApiConfig;
import com.project.objects.Pokemon;
import com.project.utils.PokemonFetched;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;
import java.util.List;

import static java.util.Collections.min;

@ApplicationScoped
public class PokemonService {
    @Inject
    EntityManager em;

    @Inject
    ApiConfig apiConfig;

    OkHttpClient client = new OkHttpClient();

    public Pokemon createPokemon(int id) {
        PokemonFetched fetchedPokemon = fetchPokemonFromApi(id);
        if (fetchedPokemon != null) {
            Pokemon pokemon = new Pokemon(fetchedPokemon);
            em.persist(pokemon);
            return pokemon;
        }
        return null;
    }// Permet de créer un pokémon

    @Transactional
    public List<Pokemon> obtenirPokemonList() {
        return em.createQuery(
                        "SELECT p FROM Pokemon p LEFT JOIN FETCH p.historiqueEncheres", Pokemon.class)
                .getResultList();
    }// Permet de récupérer tous les pokémons

    @Transactional
    public Pokemon getRandomPokemon() {
        int randomId = (int) (Math.random() * 1025 + 1);
        return createPokemon(randomId);
    }// Permet de récupérer un pokémon aléatoire

    public PokemonFetched fetchPokemonFromApi(int pokemonNb) {
        String pokemonRequest = apiConfig.baseUrl() + "/" + pokemonNb;
        Request request = new Request.Builder()
                .url(pokemonRequest)
                .build();

        try (Response response = client.newCall(request).execute()) {


            if (response.isSuccessful() && response.body() != null) {
                Gson gson = new Gson();
                return gson.fromJson(response.body().string(), PokemonFetched.class);


            } else {
                System.out.println("Erreur: " + response.code());
                return null;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }// Permet de récupérer un pokémon depuis l'API

    @Transactional
    public Pokemon endTrainPokemon(Long id) {
        Pokemon pokemon = em.find(Pokemon.class, id);
        if (pokemon != null) {
            long trainingTime = System.currentTimeMillis() - pokemon.getTrainingStart();
            int xp = (int) (trainingTime / 300000);
            if (xp > 10) xp = 10;
            System.out.println("xp: " + xp);
            //on augmente les stats de 1% * xp
            System.out.println("Stats avant: " + pokemon.getStats());
            pokemon.getStats().augmenterStats(xp);
            System.out.println("Stats après: " + pokemon.getStats());
            pokemon.updateValeurReelle();
            pokemon.setTrainingStart(0);
            em.merge(pokemon);
            return pokemon;
        }
        return null;
    }// Permet de terminer l'entraînement d'un pokémon

    @Transactional
    public Pokemon startTraining(Long id) {
        Pokemon pokemon = em.find(Pokemon.class, id);
        if (pokemon != null) {
            pokemon.setTrainingStart(System.currentTimeMillis());
            em.merge(pokemon);
            return pokemon;
        }
        return null;
    }// Permet de commencer l'entraînement d'un pokémon

    public Boolean isTraining(Long id) {
        Pokemon pokemon = em.find(Pokemon.class, id);
        if (pokemon != null) {
            if (pokemon.getTrainingStart() != 0) {
                return true;
            } else {
                return false;
            }
        }
        return null;
    }// Permet de savoir si un pokémon est en train de s'entraîner
}
