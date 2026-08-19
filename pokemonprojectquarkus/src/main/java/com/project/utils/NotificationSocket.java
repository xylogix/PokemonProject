package com.project.utils;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@ServerEndpoint("/notifications/{username}")
public class NotificationSocket {

    private static Map<String, Session> sessions = new ConcurrentHashMap<>();

    public static void sendToUser(String username, String message) {
        Session session = sessions.get(username);
        if (session != null && session.isOpen()) {
            session.getAsyncRemote().sendText(message);
        }
    }// Permet d'envoyer une notification à un utilisateur

    @OnOpen
    public void onOpen(Session session, @PathParam("username") String username) {
        System.out.println("WebSocket ouvert pour l'utilisateur: " + username);

        sessions.put(username, session);
    }

    @OnMessage
    public void onMessage(String message, @PathParam("username") String username) {
        System.out.println("Message reçu de " + username + ": " + message);
    }

    @OnClose
    public void onClose(Session session, @PathParam("username") String username) {
        System.out.println("WebSocket fermé pour l'utilisateur: " + username);
        sessions.remove(username);
    }

}
