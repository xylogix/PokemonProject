import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Utils/AuthContext.jsx';
import { NotificationProvider } from './Utils/NotificationContext.jsx';
import ProtectedRoute from './Utils/ProtectedRoute.jsx';
import LoginPage from './LoginPage/LoginPage.jsx';
import RoutesFile from './Utils/RoutesFile.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Styles/App.css';

function App() {
    return (
        <AuthProvider>
            <ToastContainer />
            <NotificationProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <RoutesFile />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
