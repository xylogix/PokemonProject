package com.project;

import com.project.utils.NotificationSocket;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Classe principale de configuration de l'application.
 * Elle définit le chemin de base pour toutes les ressources REST.
 */
@ApplicationPath("/api")
public class Administrateur extends Application {
}
