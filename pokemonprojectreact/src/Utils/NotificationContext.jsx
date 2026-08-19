import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const { username } = useAuth();
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!username) return;

        const socket = new WebSocket(`ws://localhost:8080/notifications/${username}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket connecté');
        };

        socket.onmessage = (event) => {
            console.log('Notification reçue:', event.data);

            setMessages((prev) => [...prev, event.data]);

            toast.info(`Info : ${event.data}`, {
                position: "top-right",
                autoClose: 5000, // 5 secondes
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        };

        socket.onclose = () => {
            console.log('WebSocket fermé');
        };

        socket.onerror = (err) => {
            console.error('WebSocket erreur:', err);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [username]);

    return (
        <NotificationContext.Provider value={{ socket: socketRef.current, messages }}>
            {children}
        </NotificationContext.Provider>
    );
};
