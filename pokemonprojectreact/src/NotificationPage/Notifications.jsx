import React, {useState, useEffect} from 'react';
import {useAuth} from '../Utils/AuthContext.jsx';
import {sendNotification} from '../Utils/notifUtils.jsx';
import '../Styles/NotificationsPage.css';

const Notifications = () => {
    const {username, updateWallet} = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const fetchNotifications = async () => {
        await updateWallet();
        try {
            const response = await fetch(
                `http://localhost:8080/api/encheres/notifications?username=${username}`
            );
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des notifications.');
            }
            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSellPokemon = async (auction) => {
        try {
            const sellResponse = await fetch('http://localhost:8080/api/users/sell_pokemon', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    id: auction.id     // ID du pokémon
                })
            });

            if (!sellResponse.ok) {
                throw new Error('Erreur lors de la vente du Pokémon.');
            }

            const deleteResponse = await fetch(
                `http://localhost:8080/api/encheres/delete_enchere?id=${auction.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!deleteResponse.ok) {
                throw new Error('Erreur lors de la suppression de l’enchère.');
            }

            await updateWallet();

            const message = await sellResponse.text();
            console.log(message);

            sendNotification(username, `Le Pokémon a bien été vendu vous gagnez ${auction.pokemon.valeurReelle} €`);

            fetchNotifications();

        } catch (err) {
            console.error(err.message);
            sendNotification(username, `Erreur lors de la vente du Pokémon : ${err.message}`);
        }
    };

    const handleAcceptAuction = async (auction) => {
        try {
            const response = await fetch(`http://localhost:8080/api/encheres/accepter_enchere`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({id: auction.id}),
            });
            if (!response.ok) {
                sendNotification(
                    username,
                    "Vous n'avez pas assez d'argent pour valider votre achat !"
                );
                throw new Error('Erreur lors de l’acceptation de l’achat.');
            }
            //on envoie une notification à l'acheteur et au vendeur
            sendNotification(username, `Vous avez remporté l'enchère pour ${auction.montant} €`);
            sendNotification(auction.utilisateur.username, `Votre enchère de ${auction.pokemon.nom} a été acceptée pour ${auction.montant} €`);
            fetchNotifications();
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleRejectAuction = async (auction) => {
        try {
            const response = await fetch(`http://localhost:8080/api/encheres/refuser_enchere`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({id: auction.id}),
            });
            if (!response.ok) {
                throw new Error('Erreur lors du refus de l’achat.');
            }
            fetchNotifications();
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleToggleDetails = (notificationId) => {
        setSelectedNotification((prev) => (prev === notificationId ? null : notificationId));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    timeRemaining: Math.max(
                        0,
                        Math.ceil(
                            (notification.startTime +
                                notification.durationMinutes * 60 * 1000 -
                                Date.now()) / 1000
                        )
                    ),
                }))
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [username]);

    if (loading) return <p className="loading-text">Chargement des notifications...</p>;
    if (error) return <p className="error-text">Erreur : {error}</p>;

    const mySales = notifications.filter(
        (n) => n.utilisateur != null && n.utilisateur.username === username
    );
    const myBids = notifications.filter(
        (n) => n.enchereur && n.enchereur.username === username
    );

    const renderNotificationList = (list, title, showActions = false) => (
        <>
            <h2 className="notification-section-title">{title}</h2>
            {list.length === 0 ? (
                <p className="notification-empty">Aucune enchère dans cette catégorie.</p>
            ) : (
                <ul className="notification-list">
                    {list.map((notification) => (
                        <li
                            key={notification.id}
                            className="notification-item"
                            onClick={() => handleToggleDetails(notification.id)}
                        >
                            <div className="notification-topline">
                <span>
                  <strong>{notification.active ? 'En attente' : 'Terminée'}</strong>
                </span>
                                <span>
                  <strong>Montant :</strong> {notification.montant} €
                </span>
                                <span>
                  <strong>Temps restant :</strong>{' '}
                                    {notification.timeRemaining > 0
                                        ? `${Math.floor(notification.timeRemaining / 60)} min ${
                                            notification.timeRemaining % 60
                                        } sec`
                                        : 'Expiré'}
                </span>
                            </div>
                            {selectedNotification === notification.id && (
                                <div className="notification-details">
                                    <p>
                                        <strong>Nom Pokémon :</strong> {notification.pokemon.nom}
                                    </p>
                                    <p>
                                        <strong>Type :</strong> {notification.pokemon.type1}{' '}
                                        {notification.pokemon.type2 && `/ ${notification.pokemon.type2}`}
                                    </p>
                                    <p>
                                        <strong>Valeur Réelle :</strong>{' '}
                                        {notification.pokemon.valeurReelle} €
                                    </p>
                                    {showActions && !notification.active && (
                                        <div className="notification-actions">
                                            <button
                                                className="accept-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAcceptAuction(notification);
                                                }}
                                            >
                                                Accepter
                                            </button>
                                            <button
                                                className="sell-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSellPokemon(notification);
                                                }}
                                            >
                                                Vendre
                                            </button>
                                            <button
                                                className="reject-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRejectAuction(notification);
                                                }}
                                            >
                                                Refuser
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );

    return (
        <div className="page-content">
            <h1>Notifications</h1>
            {renderNotificationList(mySales, 'Mes Ventes')}
            {renderNotificationList(myBids, 'Mes Enchères', true)}
        </div>
    );
};

export default Notifications;
