import express, { json, urlencoded } from 'express';
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

const accounts = [];

app.post('/login', (req, res) => {
    const { email: reqEmail, password: reqPassword } = req.body;

    if (!reqEmail || !reqPassword) {
        res.status(400).json({ message: 'Bad Request' });
    } else if (
        // Kollar om det finns en användare med samma email och lösenord
        accounts.some(
            (account) =>
                account.email === reqEmail && account.password === reqPassword
        )
    ) {
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/create-account', (req, res) => {
    const { email: reqEmail, password: reqPassword } = req.body;

    if (!reqEmail || !reqPassword) {
        res.status(400).json({ message: 'Bad Request' });
    } else if (accounts.some((account) => account.email === reqEmail)) {
        res.status(409).json({ message: 'Conflict' });
    } else {
        accounts.push({ email: reqEmail, password: reqPassword });
        res.status(201).json({ message: 'User registered successfully!' });
    }
});

export function createAccount(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    // Lägg till logik för att skapa ett konto här
    res.status(201).json({ message: 'Account created successfully!' });
}
