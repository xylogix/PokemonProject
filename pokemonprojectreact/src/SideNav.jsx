import React from 'react';
import { FaHome, FaUser, FaCog, FaBell, FaCat, FaGavel } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './Utils/AuthContext.jsx';

const SideNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // On récupère le wallet depuis le contexte
    const { wallet } = useAuth();

    const menuItems = [
        { icon: <FaHome />, label: 'Home', path: '/' },
        { icon: <FaGavel />, label: 'Enchères', path: '/enchere' },
        { icon: <FaCat />, label: 'Mes Pokémons', path: '/pokemon' },
        { icon: <FaBell />, label: 'Notifications', path: '/notifications' },
        { icon: <FaUser />, label: 'Social', path: '/socialPage' },
        { icon: <FaCog />, label: 'Paramètres', path: '/settings' },
    ];

    return (
        <div className="sidebar">
            <div className="wallet-box">
                {wallet !== null ? (
                    <p>
                        <strong>Wallet:</strong> {wallet} €
                    </p>
                ) : (
                    <p>Chargement...</p>
                )}
            </div>

            <h2>
                <span>Poké</span>
                <span>mon</span>
            </h2>

            <nav>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`menu-item ${
                            location.pathname === item.path ? 'active' : ''
                        }`}
                    >
                        <div className="menu-item-icon">{item.icon}</div>
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default SideNav;
