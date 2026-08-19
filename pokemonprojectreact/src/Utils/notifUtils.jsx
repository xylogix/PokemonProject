const sendNotification = async (username, message) => {
    try {
        const response = await fetch('http://localhost:8080/api/other/notif', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ username, message }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l’envoi de la notification.');
        }

        const data = await response.json();
        console.log(`Notification envoyée : ${data}`);
        return data;
    } catch (error) {
        console.error(`Erreur : ${error.message}`);
    }
};

export { sendNotification };