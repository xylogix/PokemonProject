import React, { useState, useEffect } from 'react';
import { useAuth } from '../Utils/AuthContext.jsx';
import EnchereCard from './EnchereCard.jsx';
import EncherePopup from './EncherePopup.jsx';
import FilterBar from '../Utils/FilterBar.jsx';

import '../Styles/EncherePage.css';

const pokemonTypes = [
    'Normal', 'Feu', 'Eau', 'Plante', 'Électrique', 'Glace',
    'Combat', 'Poison', 'Sol', 'Vol', 'Psy', 'Insecte',
    'Roche', 'Spectre', 'Dragon', 'Ténèbres', 'Acier', 'Fée'
];

const EncherePage = () => {
    const [pokemonDataList, setPokemonDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [bidAmount, setBidAmount] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('');
    const [minMontant, setMinMontant] = useState('');
    const [maxMontant, setMaxMontant] = useState('');
    const [timeLeftMap, setTimeLeftMap] = useState({});

    const { username, updateWallet } = useAuth();

    const calculateTimeLeft = (startTime, durationMinutes) => {
        const endTime = new Date(new Date(startTime).getTime() + durationMinutes * 60 * 1000);
        const difference = endTime - new Date();
        if (difference > 0) {
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);
            return `${minutes} min ${seconds < 10 ? '0' : ''}${seconds} s`;
        }
        return 'Terminé';
    };

    useEffect(() => {
        const fetchPokemon = async () => {
            await updateWallet();
            try {
                const response = await fetch('http://localhost:8080/api/encheres/encheres_actives');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données.');
                }
                const data = await response.json();
                const processedData = data.map((enchere) => ({
                    ...enchere,
                    utilisateur: enchere.utilisateur?.username || 'Utilisateur inconnu',
                }));

                const filteredData = processedData.filter(
                    (enchere) => enchere.utilisateur !== username
                );

                setPokemonDataList(filteredData); // on va afficher les encheres qui ne sont pas à nous

                const initialTimeLeft = filteredData.reduce((acc, enchere) => {
                    acc[enchere.id] = calculateTimeLeft(enchere.startTime, enchere.durationMinutes);
                    return acc;
                }, {});
                setTimeLeftMap(initialTimeLeft);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [username]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeftMap((prev) =>
                pokemonDataList.reduce((acc, enchere) => {
                    acc[enchere.id] = calculateTimeLeft(enchere.startTime, enchere.durationMinutes);
                    return acc;
                }, {})
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [pokemonDataList]);

    const handleViewDetails = (pokemon) => {
        setSelectedPokemon(pokemon);
        setBidAmount(pokemon.montant || 0);
        setShowModal(true);
    };

    const handleBid = (pokemon, amount) => {
        setShowModal(false);
        setPokemonDataList((prev) =>
            prev.map((p) => (p.id === pokemon.id ? { ...p, montant: amount } : p))
        );
    };

    const filteredPokemonList = pokemonDataList
        .filter((pokemon) =>
            filterName ? pokemon.pokemon.nom.toLowerCase().includes(filterName.toLowerCase()) : true
        )
        .filter((pokemon) =>
            filterType
                ? pokemon.pokemon.type1 === filterType || pokemon.pokemon.type2 === filterType
                : true
        )
        .filter((pokemon) => (minMontant ? pokemon.montant >= parseFloat(minMontant) : true))
        .filter((pokemon) => (maxMontant ? pokemon.montant <= parseFloat(maxMontant) : true));

    if (loading) return <p style={{ textAlign: 'center' }}>Chargement des enchères...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>Erreur : {error}</p>;

    return (
        <div className="page-content">
            <h1 className="enchere-title">Enchères Pokémon</h1>

            <FilterBar
                filterName={filterName}
                setFilterName={setFilterName}
                filterType={filterType}
                setFilterType={setFilterType}
                minMontant={minMontant}
                setMinMontant={setMinMontant}
                maxMontant={maxMontant}
                setMaxMontant={setMaxMontant}
                types={pokemonTypes} // types de pokemons
            />

            <div className="enchere-cards-container">
                {filteredPokemonList.map((pokemonData) => (
                    <EnchereCard
                        key={pokemonData.id}
                        pokemonData={pokemonData}
                        timeLeft={timeLeftMap[pokemonData.id]}
                        onClick={() => handleViewDetails(pokemonData)}
                    />
                ))}
            </div>

            {showModal && selectedPokemon && (
                <EncherePopup
                    selectedPokemon={selectedPokemon}
                    bidAmount={bidAmount}
                    setBidAmount={setBidAmount}
                    ownername={username}
                    onClose={() => setShowModal(false)}
                    onBid={handleBid}
                />
            )}
        </div>
    );
};

export default EncherePage;
