import React, { useState, useEffect } from 'react';
import { useAuth } from '../Utils/AuthContext.jsx';
import AuctionPopup from './AuctionPopup.jsx';
import TrainingPopup from './TrainingPopup.jsx';
import DetailPokemonPopup from "./DetailPokemonPopup.jsx";
import { sendNotification } from '../Utils/notifUtils.jsx';
import '../Styles/PokemonPage.css';

const PokemonPage = () => {
    const [pokemonDataList, setPokemonDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Popups détails Pokémon
    const [detailPokemon, setDetailPokemon] = useState(null);
    const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

    // Popups enchère
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Popups entraînement
    const [trainingPokemon, setTrainingPokemon] = useState(null);
    const [isTrainingPopupOpen, setIsTrainingPopupOpen] = useState(false);

    // Filtres
    const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [minMontant, setMinMontant] = useState('');
    const [maxMontant, setMaxMontant] = useState('');
    const [sortKey, setSortKey] = useState('nom');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { username, updateWallet } = useAuth();

    const checkAllTraining = async (pokemons) => {
        const updatedList = await Promise.all(
            pokemons.map(async (p) => {
                const res = await fetch(`http://localhost:8080/api/pokemon/is_training?id=${p.id}`);
                if (!res.ok) {
                    throw new Error(`Erreur is_training pour le Pokémon id=${p.id}`);
                }
                const isTraining = await res.json();
                return { ...p, isTraining };
            })
        );
        return updatedList;
    };

    const fetchPokemon = async () => {
        await updateWallet();
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8080/api/users/get_user_pokemon?username=${username}`
            );
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données.');
            }
            const data = await response.json();

            const dataWithTraining = await checkAllTraining(data);

            setPokemonDataList(dataWithTraining);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, [username]);

    const openDetailPopup = (pokemonData) => {
        setDetailPokemon(pokemonData);
        setIsDetailPopupOpen(true);
    };

    const closeDetailPopup = () => {
        setDetailPokemon(null);
        setIsDetailPopupOpen(false);
    };

    const openAuctionPopup = (pokemonData) => {
        setSelectedPokemon(pokemonData);
        setIsPopupOpen(true);
    };

    const closeAuctionPopup = () => {
        setSelectedPokemon(null);
        setIsPopupOpen(false);
        fetchPokemon(); // rafraîchit la liste
    };

    const openTrainingPopup = (pokemonData) => {
        setTrainingPokemon(pokemonData);
        setIsTrainingPopupOpen(true);
    };

    const closeTrainingPopup = () => {
        setTrainingPokemon(null);
        setIsTrainingPopupOpen(false);
    };

    const handleTrainingEnded = (updatedPokemon) => {
        setPokemonDataList((prev) =>
            prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p))
        );
    };

    const handleStartTraining = async (pokemonData) => {
        try {
            const formData = new URLSearchParams();
            formData.append('id', pokemonData.id);

            const response = await fetch(`http://localhost:8080/api/pokemon/start_training`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Erreur lors du début d’entraînement.');
            }
            const updatedPokemon = await response.json();

            setPokemonDataList((prev) =>
                prev.map((p) =>
                    p.id === updatedPokemon.id
                        ? { ...updatedPokemon, isTraining: true }
                        : p
                )
            );
        } catch (err) {
            console.error(err);
            setError(`Erreur : ${err.message}`);
        }
    };

    const sortedPokemon = [...pokemonDataList]
        .filter((pokemon) => pokemon.nom.toLowerCase().includes(filter.toLowerCase()))
        .filter((pokemon) =>
            typeFilter ? pokemon.type1 === typeFilter || pokemon.type2 === typeFilter : true
        )
        .filter((pokemon) => (minMontant ? pokemon.valeurReelle >= parseFloat(minMontant) : true))
        .filter((pokemon) => (maxMontant ? pokemon.valeurReelle <= parseFloat(maxMontant) : true))
        .sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPokemon = sortedPokemon.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    if (loading) {
        return <p style={{ textAlign: 'center' }}>Chargement des données...</p>;
    }
    if (error) {
        return <p style={{ textAlign: 'center', color: 'red' }}>Erreur : {error}</p>;
    }

    return (
        <div className="page-content">
            <h1>Mes Pokémon</h1>

            <div className="pokemon-filters">
                <input
                    type="text"
                    placeholder="Rechercher un Pokémon"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">Tous les types</option>
                    <option value="Feu">Feu</option>
                    <option value="Eau">Eau</option>
                    <option value="Plante">Plante</option>
                    <option value="Électrique">Électrique</option>
                </select>
                <input
                    type="number"
                    placeholder="Montant min"
                    value={minMontant}
                    onChange={(e) => setMinMontant(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Montant max"
                    value={maxMontant}
                    onChange={(e) => setMaxMontant(e.target.value)}
                />
            </div>

            <table className="pokemon-table">
                <thead>
                <tr>
                    <th onClick={() => handleSort('sprite')}>Image</th>
                    <th onClick={() => handleSort('nom')}>Nom</th>
                    <th onClick={() => handleSort('type1')}>Type</th>
                    <th onClick={() => handleSort('valeurReelle')}>Valeur Réelle (€)</th>
                    <th>Détails</th>
                    <th>Entraînement</th>
                    <th>Enchère</th>
                </tr>
                </thead>
                <tbody>
                {currentPokemon.map((pokemonData, index) => {
                    // On utilise isTraining pour afficher le bon bouton
                    const isTraining = pokemonData.isTraining === true;

                    return (
                        <tr key={index}>
                            <td>
                                <img
                                    src={pokemonData.sprite}
                                    alt={`Sprite de ${pokemonData.nom}`}
                                />
                            </td>
                            <td>{pokemonData.nom}</td>
                            <td>
                                {pokemonData.type1}
                                {pokemonData.type2 && ` / ${pokemonData.type2}`}
                            </td>
                            <td>{pokemonData.valeurReelle}</td>
                            <td>
                                <button onClick={() => openDetailPopup(pokemonData)}>
                                    Détails
                                </button>
                            </td>

                            <td>
                                {isTraining ? (
                                    <button onClick={() => openTrainingPopup(pokemonData)}>
                                        Terminer
                                    </button>
                                ) : (
                                    <button onClick={() => handleStartTraining(pokemonData)}>
                                        Commencer
                                    </button>
                                )}
                            </td>

                            <td>
                                {isTraining ? (
                                    <button onClick={() => sendNotification(username,'Entrainement en cours')}>
                                        Entrainement en cours</button>
                                ) : (
                                    <button onClick={() => openAuctionPopup(pokemonData)}>
                                        Mettre aux enchères
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {[...Array(Math.ceil(sortedPokemon.length / itemsPerPage)).keys()].map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page + 1)}
                        className={page + 1 === currentPage ? 'active' : ''}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>

            {isDetailPopupOpen && detailPokemon && (
                <DetailPokemonPopup pokemon={detailPokemon} onClose={closeDetailPopup} />
            )}


            {isPopupOpen && selectedPokemon && (
                <AuctionPopup
                    username={username}
                    pokemon={selectedPokemon}
                    onClose={closeAuctionPopup}
                />
            )}

            {isTrainingPopupOpen && trainingPokemon && (
                <TrainingPopup
                    pokemon={trainingPokemon}
                    onClose={closeTrainingPopup}
                    onTrainingEnded={handleTrainingEnded}
                />
            )}
        </div>
    );
};

export default PokemonPage;
