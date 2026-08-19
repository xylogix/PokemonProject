package com.project.resources;

import com.project.utils.NotificationSocket;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("other")
public class OtherResource {

    @POST
    @Path("/notif")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response testNotification(@FormParam("username") String username,
                                     @FormParam("message") String message) {
        NotificationSocket.sendToUser(username, message);
        System.out.println("Notification envoyée à l'utilisateur " + username);
        return Response.ok("Notification envoyée à l'utilisateur " + username).build();
    }// Permet d'envoyer une notification à un utilisateur
}
