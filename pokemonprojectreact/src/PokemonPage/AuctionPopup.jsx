import React, { useState } from 'react';
import { sendNotification } from '../Utils/notifUtils.jsx';
import '../Styles/PokemonPage.css';

const AuctionPopup = ({ username, pokemon, onClose }) => {
    const [rawValue, setRawValue] = useState(0);
    const [duration, setDuration] = useState(10);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const calculatePrice = (value) => Math.round((value / 100) ** 2 * 100000);
    const reverseCalculateRawValue = (price) =>
        Math.min(100, Math.max(0, Math.sqrt(price / 1000) * 100));

    const price = calculatePrice(rawValue);

    const handlePriceChange = (e) => {
        const inputPrice = Math.max(0, Math.min(100000, parseInt(e.target.value) || 0));
        setRawValue(reverseCalculateRawValue(inputPrice));
    };

    const handleSliderChange = (e) => {
        setRawValue(e.target.value);
    };

    const handleSubmit = async () => {
        if (!pokemon?.id || !username) {
            alert('Données manquantes pour soumettre l’enchère.');
            return;
        }
        setConfirmSubmit(false);
        try {
            const response = await fetch('http://localhost:8080/api/users/mettre_en_vente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username,
                    id: pokemon.id,
                    montant: price,
                    duree: duration,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise aux enchères.');
            }

            sendNotification(username, `Votre enchère pour ${pokemon.nom} a été mise en ligne.`);
            onClose();
        } catch (error) {
            sendNotification(username, `Erreur lors de la mise aux enchères pour ${pokemon.nom}.`);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>
                    Mettre <span style={{ color: '#ff0000' }}>{pokemon?.nom || 'Pokémon inconnu'}</span> aux enchères ?
                </h2>
                <img
                    src={pokemon?.sprite || 'placeholder-image.png'}
                    alt={`Sprite de ${pokemon?.nom || 'Pokémon'}`}
                />
                <p>
                    <strong>Valeur actuelle :</strong>{' '}
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        {pokemon?.valeurReelle || 0} €
                    </span>
                </p>
                <p>Prix de départ :</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={rawValue}
                        onChange={handleSliderChange}
                    />
                    <input
                        type="number"
                        min="0"
                        max="100000"
                        value={price}
                        onChange={handlePriceChange}
                    />
                    <span>€</span>
                </div>
                <p>Durée de l'enchère :</p>
                <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                    <option value={1}>1 minute</option>
                    <option value={10}>10 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={240}>4 heures</option>
                    <option value={720}>12 heures</option>
                </select>
                <div style={{ marginTop: '20px' }}>
                    {confirmSubmit ? (
                        <>
                            <p>Confirmer la mise aux enchères ?</p>
                            <button value="confirm" onClick={handleSubmit}>
                                Oui, confirmer
                            </button>
                        </>
                    ) : (
                        <button value="submit" onClick={() => setConfirmSubmit(true)}>
                            Mettre aux enchères
                        </button>
                    )}
                    <button value="cancel" onClick={onClose}>
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuctionPopup;
