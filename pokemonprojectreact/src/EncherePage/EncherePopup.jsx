import React from 'react';
import { useAuth } from '../Utils/AuthContext.jsx';
import { sendNotification } from '../Utils/notifUtils.jsx';
import '../Styles/EncherePage.css';

const EncherePopup = ({ selectedPokemon, bidAmount, setBidAmount, onClose, onBid }) => {
    const { username } = useAuth();

    const handleBid = async () => {
        const response = await fetch('http://localhost:8080/api/encheres/surencherir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                id: selectedPokemon.id,
                username: username,
                montant: bidAmount,
            }),
        });

        if (response.ok) {
            sendNotification(
                username,
                `Vous avez surenchéri sur ${selectedPokemon.pokemon.nom}`
            );
            onBid(selectedPokemon, bidAmount); //on va surenchérir sur le pokemon

            console.log(selectedPokemon);

            // Notification pour le proprietaire de base
            sendNotification(
                selectedPokemon.utilisateur,
                `${username} a surenchéri sur votre Pokémon ${selectedPokemon.pokemon.nom}`
            );
        } else {
            const error = await response.text();
            console.error('Erreur lors de la surenchère :', error);
            sendNotification(username, `Il faut entrer un prix plus grand que la dernière enchère`);
        }

    };

    return (
        <div className="enchere-popup-overlay">
            <div className="enchere-popup-content">
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <img
                    className="popup-pokemon-sprite"
                    src={selectedPokemon.pokemon.sprite}
                    alt={`Sprite de ${selectedPokemon.pokemon.nom}`}
                />
                <h2 className="popup-pokemon-name">{selectedPokemon.pokemon.nom}</h2>
                <p><strong>Type :</strong> {selectedPokemon.pokemon.type1}</p>
                <p><strong>HP :</strong> {selectedPokemon.pokemon.stats.hp}</p>
                <p><strong>ATK :</strong> {selectedPokemon.pokemon.stats.atk}</p>
                <p><strong>DEF :</strong> {selectedPokemon.pokemon.stats.def}</p>

                <input
                    type="range"
                    min={(selectedPokemon.montant || 0)}
                    max={(selectedPokemon.montant || 0) + 500}
                    step="10"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="enchere-slider"
                />
                <p>
                    <strong>Montant de l'enchère :</strong> {bidAmount} €
                </p>

                <div className="popup-buttons">
                    <button className="enchere-button" onClick={handleBid}>
                        Enchérir
                    </button>
                    <button className="flip-button" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EncherePopup;
