package com.project.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

public class ResponseUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Crée une réponse HTTP contenant l'objet sérialisé en JSON.
     * @param obj L'objet à convertir en JSON.
     * @return Réponse HTTP.
     */
    public static Response buildJsonResponse(Object obj) {
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
            return Response.ok(json).type(MediaType.APPLICATION_JSON).build();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Response.serverError().entity("Erreur lors de la conversion en JSON.").build();
        }
    }
}
