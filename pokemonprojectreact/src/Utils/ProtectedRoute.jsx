import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    // Si pas de token, redirige vers la page de login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Sinon, affiche le contenu de la route protégée
    return children;
};

export default ProtectedRoute;
