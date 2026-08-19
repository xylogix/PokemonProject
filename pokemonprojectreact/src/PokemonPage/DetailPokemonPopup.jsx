import React from 'react';

const DetailPokemonPopup = ({ pokemon, onClose }) => {
    if (!pokemon) return null;

    return (
        <div className="popup">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>
                    X
                </button>
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
                        <strong>Valeur Réelle :</strong> {pokemon.valeurReelle} €
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DetailPokemonPopup;
