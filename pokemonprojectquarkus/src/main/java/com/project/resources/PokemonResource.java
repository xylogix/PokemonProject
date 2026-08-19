package com.project.resources;

import com.project.objects.Pokemon;
import com.project.services.PokemonService;
import com.project.utils.ResponseUtil;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/pokemon")
public class PokemonResource {

    @Inject
    PokemonService pokemonService;

    @POST
    @Path("/create_pokemon")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response creerPokemon(@FormParam("id") String id) {
        if (id == null || id.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("L'id du pokémon est obligatoire.").build();
        }
        pokemonService.createPokemon(Integer.parseInt(id));
        return Response.ok("Pokémon créé avec succès").build();
    }// Permet de créer un pokémon

    @POST
    @Path("/create_random_pokemon")
    @Produces(MediaType.APPLICATION_JSON)
    public Response creerPokemonAleatoire() {
        pokemonService.getRandomPokemon();
        return Response.ok("Pokémon aléatoire créé avec succès").build();
    }// Permet de créer un pokémon aléatoire

    @GET
    @Path("/list_pokemon")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenirPokemonList() {
        List<Pokemon> pkm = pokemonService.obtenirPokemonList();
        return ResponseUtil.buildJsonResponse(pkm);
    }// Permet de récupérer tous les pokémons

    @GET
    @Path("/end_training")
    @Produces(MediaType.APPLICATION_JSON)
    public Response trainUnPokemon(@QueryParam("id") Long id) {
        Pokemon pokemon = pokemonService.endTrainPokemon(id);
        return ResponseUtil.buildJsonResponse(pokemon);
    }// Permet de terminer l'entraînement d'un pokémon

    @POST
    @Path("/start_training")
    @Produces(MediaType.APPLICATION_JSON)
    public Response startTraining(@FormParam("id") Long id) {
        Pokemon pokemon = pokemonService.startTraining(id);
        return ResponseUtil.buildJsonResponse(pokemon);
    }// Permet de commencer l'entraînement d'un pokémon

    @GET
    @Path("/is_training")
    @Produces(MediaType.APPLICATION_JSON)
    public Response isTraining(@QueryParam("id") Long id) {
        Boolean isTraining = pokemonService.isTraining(id);
        return ResponseUtil.buildJsonResponse(isTraining);
    }// Permet de savoir si un pokémon est en cours d'entraînement
}