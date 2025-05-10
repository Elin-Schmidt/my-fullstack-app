const express = require('express');
const app = express();
const email = 'alice@example.com';
const password = 'secret';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    // Lägg till logik för att hantera inloggning här
    res.status(200).json({ message: 'Login successful!' });
};

app.post('/login', (req, res) => {
    const { email: reqEmail, password: reqPassword } = req.body;

    if (!reqEmail || !reqPassword) {
        res.status(400).json({ message: 'Bad Request' });
    } else if (reqEmail === email && reqPassword === password) {
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});
