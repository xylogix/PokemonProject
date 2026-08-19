import React, { useState } from 'react';
import '../Styles/EncherePage.css';

const EnchereCard = ({ pokemonData, timeLeft, onClick }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div
            className={`enchere-card ${isFlipped ? 'flipped' : ''}`}
            onClick={!isFlipped ? handleFlip : undefined}
        >
            <div className="enchere-card-front">
                <img
                    className="pokemon-sprite"
                    src={pokemonData.pokemon.sprite}
                    alt={`Sprite de ${pokemonData.pokemon.nom}`}
                />
                <h2 className="pokemon-name">{pokemonData.pokemon.nom}</h2>
                <p className="pokemon-type">
                    <strong>Type :</strong>{' '}
                    {pokemonData.pokemon.type1}
                    {pokemonData.pokemon.type2 && ` / ${pokemonData.pokemon.type2}`}
                </p>
                <p className="pokemon-montant">
                    <strong>Montant actuel :</strong>{' '}
                    <span className="montant-value">{pokemonData.montant} €</span>
                </p>
                <p className="pokemon-timer">
                    <strong>Temps restant :</strong>{' '}
                    <span className="timer-value">{timeLeft || 'Calcul...'}</span>
                </p>
                <p className="pokemon-enchereur">
                    <strong>Dernier enchérisseur :</strong>{' '}
                    {pokemonData.enchereur?.username || 'Aucun'}
                </p>
            </div>

            <div className="enchere-card-back">
                <h2 className="pokemon-name-back">{pokemonData.pokemon.nom}</h2>
                <p><strong>Vendeur initial :</strong> {pokemonData.utilisateur || 'Non spécifié'}</p>
                <p><strong>HP :</strong> {pokemonData.pokemon.stats.hp}</p>
                <p><strong>ATK :</strong> {pokemonData.pokemon.stats.atk}</p>
                <p><strong>DEF :</strong> {pokemonData.pokemon.stats.def}</p>
                <p><strong>Sp. ATK :</strong> {pokemonData.pokemon.stats.spe_atk}</p>
                <p><strong>Sp. DEF :</strong> {pokemonData.pokemon.stats.spe_def}</p>
                <p><strong>VIT :</strong> {pokemonData.pokemon.stats.vit}</p>
                <button className="enchere-button" onClick={onClick}>Enchérir</button>
                <button className="flip-button" onClick={handleFlip}>Retourner</button>
            </div>
        </div>
    );
};

export default EnchereCard;
