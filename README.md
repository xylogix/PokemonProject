# PokéEnchères — Plateforme d'enchères de cartes Pokémon

Application web full-stack développée en binôme dans le cadre d'un projet universitaire.
Elle permet aux utilisateurs de mettre aux enchères des cartes Pokémon, de surenchérir en
temps réel et de recevoir des notifications instantanées.

## Fonctionnalités

- **Authentification** : inscription et connexion sécurisées (mots de passe hachés avec BCrypt).
- **Gestion des Pokémon** : collection personnelle, statistiques, entraînement.
- **Système d'enchères** : création d'enchères, surenchère, acceptation/refus, historique par utilisateur.
- **Notifications temps réel** : mises à jour push via WebSockets (nouvelle enchère, surenchère, etc.).
- **Espace social & paramètres** : pages dédiées côté frontend.

## Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | React 18, React Router, Vite, Axios, React-Toastify |
| **Backend** | Java, Quarkus (RESTEasy, Hibernate ORM, Scheduler, WebSockets) |
| **Base de données** | H2 (fichier embarqué) |
| **Sécurité** | BCrypt (jBCrypt) |

## Architecture

```
PokemonProject/
├── pokemonprojectreact/     # Frontend React (Vite)
│   └── src/
│       ├── HomePage/  PokemonPage/  EncherePage/  SocialPage/ ...
│       └── Utils/           # Contextes (Auth, Notifications), routes, helpers
└── pokemonprojectquarkus/   # Backend Quarkus
    └── src/main/java/com/project/
        ├── resources/       # Endpoints REST (users, enchères, notifications)
        ├── services/        # Logique métier
        └── objects/         # Entités JPA (Utilisateur, Pokemon, Enchere)
```

## Lancer le projet en local

### Prérequis
- Node.js 18+ et npm
- Java 21+

### Backend (Quarkus)
```bash
cd pokemonprojectquarkus
./gradlew quarkusDev
```
L'API démarre par défaut sur `http://localhost:8080`.

### Frontend (React)
```bash
cd pokemonprojectreact
npm install
npm run dev
```
L'interface démarre par défaut sur `http://localhost:5173`.

## Principaux endpoints REST

| Méthode | Endpoint | Rôle |
|---|---|---|
| `POST` | `/users/register_user` | Création de compte |
| `POST` | `/users/login` | Authentification |
| `POST` | `/encheres/create_random_enchere` | Créer une enchère |
| `POST` | `/encheres/surencherir` | Surenchérir |
| `POST` | `/encheres/accepter_enchere` | Accepter une offre |
| `GET`  | `/encheres/encheres_actives` | Lister les enchères actives |
| `GET`  | `/notifications` | Flux de notifications (WebSocket) |

## Auteurs

Projet réalisé en binôme — Matthéo Jaouen & Tommy Debord.

> Projet académique (UE informatique, Université de Limoges). Base de données de
> démonstration : H2 en fichier local, non destinée à un usage en production.
