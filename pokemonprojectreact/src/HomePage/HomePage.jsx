import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/HomePage.css';
import PokemonCard from './PokemonCard.jsx';
import { useAuth } from '../Utils/AuthContext.jsx';

const HomePage = () => {
    const [pokemonDataList, setPokemonDataList] = useState([]);
    const [timeLeftMap, setTimeLeftMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { username, updateWallet } = useAuth();
    const navigate = useNavigate();

    // Même fonction de calcul que dans EncherePage
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
                const response = await fetch('http://localhost:8080/api/encheres/get_random_encheres?nb=3');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données.');
                }
                const data = await response.json();
                setPokemonDataList(data);

                const initialTimeMap = {};
                data.forEach((enchere) => {
                    if (enchere.startTime && enchere.durationMinutes && enchere.id) {
                        initialTimeMap[enchere.id] = calculateTimeLeft(
                            enchere.startTime,
                            enchere.durationMinutes
                        );
                    }
                });
                setTimeLeftMap(initialTimeMap);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemon();
    }, []);

    // maj du timeLeft toutes les secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeftMap((prevMap) => {
                const updatedMap = { ...prevMap };
                // Recalcule pour chaque enchère dans pokemonDataList
                pokemonDataList.forEach((enchere) => {
                    if (enchere.startTime && enchere.durationMinutes && enchere.id) {
                        updatedMap[enchere.id] = calculateTimeLeft(
                            enchere.startTime,
                            enchere.durationMinutes
                        );
                    }
                });
                return updatedMap;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [pokemonDataList]);

    if (loading) {
        return <p style={{ textAlign: 'center' }}>Chargement des données...</p>;
    }

    if (error) {
        return <p style={{ textAlign: 'center', color: 'red' }}>Erreur : {error}</p>;
    }

    return (
        <div className="page-content">
            <h1 style={{ textAlign: 'center' }}>Bonjour {username} !</h1>

            <div className="pokemon-cards-container">
                {pokemonDataList.map((pokemonData) => {
                    const timeLeft = timeLeftMap[pokemonData.id] || null;

                    return (
                        <PokemonCard
                            key={pokemonData.id}
                            pokemonData={pokemonData}
                            timeLeft={timeLeft}
                        />
                    );
                })}
            </div>

            <button
                className="big-button"
                onClick={() => navigate('/enchere')}
            >
                Voir les Encheres
            </button>
        </div>
    );
};

export default HomePage;
