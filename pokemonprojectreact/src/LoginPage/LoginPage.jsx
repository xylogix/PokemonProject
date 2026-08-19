import React, { useState } from 'react';
import { useAuth } from '../Utils/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../Styles/LoginPage.css'; // Import du fichier CSS

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false); // État pour gérer l'ouverture de la Pokéball
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isRegister
                ? 'http://localhost:8080/api/users/register_user'
                : 'http://localhost:8080/api/users/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username,
                    password,
                }),
            });

            const result = await response.text();

            if (response.ok) {
                if (isRegister) {
                    setError('Inscription réussie ! Connectez-vous maintenant.');
                    setIsRegister(false);
                } else if (result === 'Connexion réussie') {
                    login('tokenCompletementSecurise', username);
                    setLoggedIn(true);
                    setTimeout(() => navigate('/'), 2000);
                } else {
                    setError(result);
                }
            } else {
                setError(result || 'Erreur inattendue.');
            }
        } catch (err) {
            setError('Erreur de connexion. Vérifiez votre serveur.');
        }
    };

    return (
        <div className="login-container">
            {/* Pokémon animés */}
            {[...Array(10)].map((_, i) => (
                <img
                    key={i}
                    className="pokemon"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`}
                    alt={`Pokémon ${i + 1}`}
                    style={{
                        top: `${Math.random() * 90}vh`,
                        left: `${Math.random() * 100}vw`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}

            <div className={`pokeball ${loggedIn ? 'pokeball-open' : ''}`}>
                <div className="center-circle"></div>
                <div className="inner-circle"></div>
            </div>

            {!loggedIn && (
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>{isRegister ? 'Inscription' : 'Connexion'}</h2>
                    {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">{isRegister ? 'S’inscrire' : 'Se connecter'}</button>
                    <p
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError(null);
                        }}
                    >
                        {isRegister
                            ? 'Vous avez déjà un compte ? Connectez-vous'
                            : 'Pas encore de compte ? Inscrivez-vous'}
                    </p>
                </form>
            )}
        </div>
    );
};

export default LoginPage;
