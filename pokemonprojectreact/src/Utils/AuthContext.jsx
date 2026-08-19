import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || null);

    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        if (username) {
            updateWallet();
        }
    }, [username]);

    const login = (newToken, user) => {
        setToken(newToken);
        setUsername(user);
        localStorage.setItem('token', newToken);
        localStorage.setItem('username', user);
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        setWallet(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    };

    const updateWallet = async () => {
        if (!username) return;
        try {
            const response = await fetch(`http://localhost:8080/api/users/get_wallet?username=${username}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du portefeuille.');
            }
            const data = await response.json();

            setWallet(data);

        } catch (err) {
            console.error('Erreur updateWallet:', err.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                wallet,
                login,
                logout,
                updateWallet
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
