package com.project.resources;

import com.project.objects.Enchere;
import com.project.services.EnchereService;
import com.project.utils.ResponseUtil;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/encheres")
public class EnchereResource {

    @Inject
    EnchereService enchereService;

    @POST
    @Path("/create_random_enchere")
    @Produces(MediaType.APPLICATION_JSON)
    public Response creerEnchereAleatoire() {
        enchereService.createRandomEnchere();
        return Response.ok("Enchère aléatoire créée avec succès").build();
    }// Permet de créer une enchère aléatoire

    @GET
    @Path("/get_random_enchere")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEnchereAleatoire() {
        Enchere enchere = enchereService.getRandomEnchere();
        return ResponseUtil.buildJsonResponse(enchere);
    }// Permet de récupérer une enchère aléatoire

    @GET
    @Path("/get_random_encheres")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEncheresAleatoires(@QueryParam("nb") int nb) {
        List<Enchere> encheres = enchereService.getRandomEncheres(nb);
        return ResponseUtil.buildJsonResponse(encheres);
    }// Permet de récupérer plusieurs enchères aléatoires

    @GET
    @Path("/encherelist")
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenirEnchereList() {
        List<Enchere> encheres = enchereService.obtenirEnchereList();
        return ResponseUtil.buildJsonResponse(encheres);
    }// Permet de récupérer toutes les enchères

    @GET
    @Path("/encheres_actives")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEncheresActives() {
        List<Enchere> encheres = enchereService.getEncheresActives();
        return ResponseUtil.buildJsonResponse(encheres);
    }// Permet de récupérer toutes les enchères actives

    @DELETE
    @Path("/delete_enchere")
    @Produces(MediaType.APPLICATION_JSON)
    public Response supprimerEnchere(@QueryParam("id") Long id) {
        enchereService.supprimerEnchere(id);
        return Response.ok("Enchère supprimée avec succès").build();
    }// Permet de supprimer une enchère

    @GET
    @Path("/get_enchere_by_user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEnchereByUser(@QueryParam("username") String username) {
        List<Enchere> encheres = enchereService.getEncheresEnCoursByUser(username);
        return ResponseUtil.buildJsonResponse(encheres);
    }// Permet de récupérer les enchères d'un utilisateur

    @POST
    @Path("/surencherir")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response surencherir(@FormParam("id") Long id, @FormParam("username") String username, @FormParam("montant") int montant) {
        int e = enchereService.surencherir(id, username, montant);
        if (e == -1) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Impossible de surenchérir").build();
        }
        return Response.ok("Surenchère réussie").build();
    }// Permet de surenchérir sur une enchère

    @POST
    @Path("/accepter_enchere")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response accepterEnchere(@FormParam("id") Long id) {
        int result = enchereService.accepterEnchere(id);
        if (result == -1) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Impossible d'accepter l'enchère").build();
        }
        return Response.ok("Enchère acceptée avec succès").build();
    }// Permet d'accepter une enchère

    @POST
    @Path("/refuser_enchere")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response refuserEnchere(@FormParam("id") Long id) {
        enchereService.refuserEnchere(id);
        return Response.ok("Enchère refusée avec succès").build();
    }// Permet de refuser une enchère

    @GET
    @Path("/notifications")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNotifications(@QueryParam("username") String username) {
        List<Enchere> encheres = enchereService.getEncheresEnCoursByUser(username);
        return ResponseUtil.buildJsonResponse(encheres);
    }// Permet de récupérer les notifications liées aux enchères d'un utilisateur
}