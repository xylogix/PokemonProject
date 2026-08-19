package com.project.resources;

import com.project.objects.Pokemon;
import com.project.utils.NotificationSocket;
import com.project.objects.Utilisateur;
import com.project.services.UtilisateurService;
import com.project.utils.ResponseUtil;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/users")
public class UserResource {

    @Inject
    UtilisateurService utilisateurService;
    @POST
    @Path("/register_user")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response creerUtilisateur(@FormParam("username") String username, @FormParam("password") String password) {
        if (username == null || username.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Le nom d'utilisateur est obligatoire.").build();
        } else if (password == null || password.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Le mot de passe est obligatoire.").build();
        }
        utilisateurService.createUser(username, password);
        return Response.ok("Utilisateur créé avec succès").build();
    }// Permet de créer un utilisateur

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(@FormParam("username") String username, @FormParam("password") String password) {
        Utilisateur user = utilisateurService.obtenirUserByName(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Utilisateur non trouvé.").build();
        }
        if (utilisateurService.checkUser(username, password)) {
            return Response.ok("Connexion réussie").build();
        }
        return Response.ok("Mauvais mot de passe").build();
    }// Permet de connecter un utilisateur

    @GET
    @Path("/list_users")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenirListeUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurService.obtenirUserList();
        return ResponseUtil.buildJsonResponse(utilisateurs);
    }// Permet de récupérer tous les utilisateurs

    @DELETE
    @Path("/delete_user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response supprimerUtilisateur(@QueryParam("username") String username) {
        utilisateurService.supprimerUtilisateur(username);
        return Response.ok("Utilisateur supprimé avec succès").build();
    }// Permet de supprimer un utilisateur

    @GET
    @Path("/get_user_pokemon")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserPokemon(@QueryParam("username") String username) {
        Utilisateur user = utilisateurService.obtenirUserByName(username);
        return ResponseUtil.buildJsonResponse(user.getPokemons());
    }// Permet de récupérer les pokémons d'un utilisateur

    @GET
    @Path("/get_wallet")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWallet(@QueryParam("username") String username) {
        Utilisateur user = utilisateurService.obtenirUserByName(username);
        return ResponseUtil.buildJsonResponse(user.getWallet());
    }// Permet de récupérer le wallet d'un utilisateur

    @POST
    @Path("/set_wallet")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeWallet(@FormParam("username") String username, @FormParam("value") int value) {
        int r = utilisateurService.setWallet(username, value);
        if (r == -1) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Impossible de mettre à jour le wallet").build();
        }
        return Response.ok("Wallet mis à jour avec succès").build();
    }// Permet de mettre à jour le wallet d'un utilisateur

    @POST
    @Path("/mettre_en_vente")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response mettreEnVente(@FormParam("username") String username, @FormParam("id") Long id, @FormParam("montant") int montant, @FormParam("duree") int duree) {
        utilisateurService.mettreAuxEncheres(username, id, montant, duree);
        return Response.ok("Pokémon mis en vente avec succès").build();
    }// Permet de mettre un pokémon aux enchères

    @GET
    @Path("/list_pokemon_by_user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenirPokemonListByUser(@QueryParam("username") String username) {
        List<Pokemon> pkm = utilisateurService.obtenirPokemonListByUser(username);
        return ResponseUtil.buildJsonResponse(pkm);
    }// Permet de récupérer les pokémons d'un utilisateur

    @POST
    @Path("/give_pokemon")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response givePokemon(@FormParam("username") String username, @FormParam("id") Long id) {
        utilisateurService.givePokemon(username, id);
        return Response.ok("Pokémon donné avec succès").build();
    }// Permet de donner un pokémon à un utilisateur

    @POST
    @Path("/give_random_pokemon")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response giveRandomPokemon(@FormParam("username") String username) {
        utilisateurService.giveRandomPokemon(username);
        return Response.ok("Pokémon donné avec succès").build();
    }// Permet de donner un pokémon aléatoire à un utilisateur

    @POST
    @Path("/sell_pokemon")
    @Produces(MediaType.APPLICATION_JSON)
    public Response sellPokemon(@FormParam("id") Long id) {
        utilisateurService.sellPokemon(id);
        return Response.ok("Pokémon vendu avec succès").build();
    }// Permet de vendre un pokémon

    @GET
    @Path("/get_top_users")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTopUsers() {
        List<Utilisateur> topUsers = utilisateurService.getTopUsers();
        return ResponseUtil.buildJsonResponse(topUsers);
    }// Permet de récupérer les meilleurs utilisateurs ceux qui ont le plus d'argent
}
