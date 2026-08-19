import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import SideNav from '../SideNav';

// Import des pages
import HomePage from '../HomePage/HomePage.jsx';
import PokemonPage from '../PokemonPage/PokemonPage.jsx';
import EncherePage from '../EncherePage/EncherePage.jsx';
import Notifications from '../NotificationPage/Notifications.jsx';
import SocialPage from '../SocialPage/SocialPage.jsx';
import SettingsPage from '../SettingsPage/SettingsPage.jsx';

function RoutesFile() {
    const location = useLocation();

    return (
        <div className="app-container" style={{ display: 'flex' }}>
            <SideNav />
                        <div className="route-container">
                            <div className="content-container" style={{ flex: 1, overflowY: 'auto' }}>
                                <Routes location={location}>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/pokemon" element={<PokemonPage />} />
                                    <Route path="/enchere" element={<EncherePage />} />
                                    <Route path="/notifications" element={<Notifications />} />
                                    <Route path="/socialPage" element={<SocialPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="*" element={<HomePage />} />
                                </Routes>
                            </div>
                        </div>
        </div>
    );
}

export default RoutesFile;
