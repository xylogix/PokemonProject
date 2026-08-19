import React, { useState } from 'react';
import { useAuth } from '../Utils/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../Styles/SettingsPage.css';

const SettingsPage = () => {
    const { username, logout, updateWallet } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleLogout = () => {
        logout(); // on enleve le token du local storage
        navigate('/login');
    };


    const handleGiveMoney = async () => {
        if (!amount || isNaN(amount)) {
            setMessage('Veuillez entrer un montant valide.');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/users/set_wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, value: amount }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du wallet.');
            }
            setMessage(`Votre wallet a été mis à jour avec ${amount} €.`);
            setAmount('');
        } catch (error) {
            setMessage('Une erreur est survenue lors de la mise à jour du wallet.');
            console.error(error);
        }
    };

    return (
        <div className="settings-page-container">
            <div className="pokemon-background">
                {[...Array(100)].map((_, i) => (
                    <img
                        key={i}
                        className="floating-pokemon"
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`}
                        alt={`Pokémon ${i + 1}`}
                        style={{
                            top: `${Math.random() * 90}vh`,
                            left: `${Math.random() * 100}vw`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="settings-content">
                <div className="settings-title">Paramètres</div>

                <div className="add-money-section">
                    <h2>Ajouter de l'argent</h2>
                    <input
                        type="number"
                        placeholder="Montant"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={handleGiveMoney}>Ajouter</button>
                    {message && <p className="add-money-message">{message}</p>}
                </div>

                <button className="logout-button" onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
