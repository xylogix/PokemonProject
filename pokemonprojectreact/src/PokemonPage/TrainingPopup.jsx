import React, {useState, useEffect} from 'react';
import {sendNotification} from '../Utils/notifUtils.jsx';
import {useAuth} from '../Utils/AuthContext.jsx';

const TrainingPopup = ({pokemon, onClose, onTrainingEnded}) => {
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const [bonus, setBonus] = useState(0); // Pourcentage à gagner (max 10)
    const {username, updateWallet} = useAuth();

    useEffect(() => {
        if (!pokemon.trainingStart) return;

        const start = new Date(pokemon.trainingStart).getTime();
        const now = Date.now();
        const diffMs = now - start;
        const diffMin = Math.floor(diffMs / 1000 / 60);
        setElapsedMinutes(diffMin);

        const computedBonus = Math.min(10, Math.floor(diffMin / 5));
        setBonus(computedBonus);
    }, [pokemon]);

    const handleConfirm = async () => {
        try {
            // Retirer le coût de l'entraînement du wallet
            const cost = 20 * bonus;
            const walletResponse = await fetch('http://localhost:8080/api/users/set_wallet', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    username: username,
                    value: -cost, //on enleve le cout
                }),
            });

            await updateWallet();

            if (walletResponse.ok) {


                // Appel pour terminer l'entraînement
                const response = await fetch(`http://localhost:8080/api/pokemon/end_training?id=${pokemon.id}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la fin de l’entraînement.');
                }

                const updatedPokemon = await response.json();

                await sendNotification(
                    username,
                    `Entraînement terminé ! ${pokemon.nom} a gagné +${bonus}% en stats. ${cost} € ont été retirés de votre portefeuille.`
                );

                onTrainingEnded(updatedPokemon);
            } else {
                await sendNotification(username, `Erreur : avez vous assez d’argent ?`);
            }
        } catch (error) {
            console.error(error);

            await sendNotification(
                username,
                `Erreur lors de la fin de l’entraînement ou de la mise à jour du portefeuille.`
            );
        } finally {
            onClose();
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Terminer l’entraînement de {pokemon.nom}</h2>
                <p>Temps écoulé : {elapsedMinutes} minutes</p>
                <p>Vous allez gagner +{bonus}% de stats (max 10%)</p>
                <p>Cela vous coûtera {20 * bonus} €</p>

                <div style={{marginTop: '20px'}}>
                    <button onClick={handleConfirm} style={{marginRight: '10px'}}>
                        Confirmer
                    </button>
                    <button onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default TrainingPopup;
