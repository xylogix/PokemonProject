import React from 'react';

const PokemonCard = ({ pokemonData, timeLeft }) => {
    const pokemon = pokemonData.pokemon || pokemonData;
    const montant = pokemonData.montant || null;
    const durationMinutes = pokemonData.durationMinutes || null;

    return (
        <div className="pokemon-card">
            {pokemon.sprite && (
                <img
                    src={pokemon.sprite}
                    alt={`Sprite de ${pokemon.nom}`}
                />
            )}
            <h2>{pokemon.nom}</h2>
            <p>
                <strong>Type : </strong>
                {pokemon.type1}
                {pokemon.type2 && ` / ${pokemon.type2}`}
            </p>

            <div className="stats-row-1">
                <div>
                    <strong>HP :</strong> {pokemon.stats.hp}
                </div>
                <div>
                    <strong>ATK :</strong> {pokemon.stats.atk}
                </div>
                <div>
                    <strong>DEF :</strong> {pokemon.stats.def}
                </div>
            </div>

            <div className="stats-row-2">
                <div>
                    <strong>VIT :</strong> {pokemon.stats.vit}
                </div>
                <div>
                    <strong>SPE ATK :</strong> {pokemon.stats.spe_atk}
                </div>
                <div>
                    <strong>SPE DEF :</strong> {pokemon.stats.spe_def}
                </div>
            </div>

            <p>
                <strong>Valeur Réelle :</strong> {pokemon.valeurReelle} $
            </p>

            {montant && (
                <p>
                    <strong>Montant Actuel :</strong> {montant} $
                </p>
            )}

            {durationMinutes && (
                <p>
                    <strong>Durée de l'enchère :</strong> {durationMinutes} minutes
                </p>
            )}

            {timeLeft && (
                <p>
                    <strong>Temps restant :</strong> {timeLeft}
                </p>
            )}
        </div>
    );
};

export default PokemonCard;
