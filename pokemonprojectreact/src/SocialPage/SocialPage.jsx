import React, { useState, useEffect } from 'react';
import '../Styles/SocialPage.css';

const SocialPage = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userPokemons, setUserPokemons] = useState([]);

    useEffect(() => {
        //  les utilisateurs les plus riches
        fetch('http://localhost:8080/api/users/get_top_users')
            .then(response => response.json())
            .then(data => setTopUsers(data))
            .catch(error => console.error('Erreur lors de la récupération des top utilisateurs:', error));

        //  la liste des utilisateurs
        fetch('http://localhost:8080/api/users/list_users')
            .then(response => response.json())
            .then(data => setAllUsers(data))
            .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserClick = (username) => {
        fetch(`http://localhost:8080/api/users/get_user_pokemon?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setUserPokemons(data);
                setSelectedUser(username);
            })
            .catch(error => console.error('Erreur lors de la récupération des Pokémons:', error));
    };

    const closePopup = () => {
        setSelectedUser(null);
        setUserPokemons([]);
    };

    return (
        <div className="social-page">
            <div className="scoreboard">
                <h2>Top 10 Utilisateurs</h2>
                <ul>
                    {topUsers.map((user, index) => (
                        <li key={index}>
                            <span>{index + 1}. {user.username}</span>
                            <span>{user.wallet} €</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="user-list">
                <h2>Liste des joueurs</h2>
                <input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <ul>
                    {filteredUsers.map((user, index) => (
                        <li key={index} onClick={() => handleUserClick(user.username)}>
                            <span>{user.username}</span>
                            <span>{user.wallet} €</span>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedUser && (
                <div className="user-popup">
                    <div className="popup-content">
                        <h3>Pokémons de {selectedUser}</h3>
                        <ul>
                            {userPokemons.map((pokemon, index) => (
                                <li key={index}>
                                    <img src={pokemon.sprite} alt={pokemon.nom} />
                                    <div className="pokemon-info">
                                        <p><strong>{pokemon.nom}</strong></p>
                                        <p>Types : {pokemon.type1} {pokemon.type2 ? `, ${pokemon.type2}` : ''}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button onClick={closePopup}>Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialPage;
