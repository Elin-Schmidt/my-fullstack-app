import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@utils/api.ts';
import styles from '../pages/Auth/AuthPage.module.css';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                {
                    username,
                    firstname,
                    lastname,
                    email,
                    password
                }
            );

            if (response.status === 201) {
                setMessage('Registrering lyckades! Du kan nu logga in.');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setMessage(
                    err.response?.data?.message || 'Registrering misslyckades.'
                );
            } else {
                setMessage('Registrering misslyckades.');
            }
        }
    };

    return (
        <form
            onSubmit={handleRegister}
            className={styles.formContainer}
            autoComplete="on"
        >
            <h2 className={styles.authTitle}>Registrera dig</h2>
            {message && (
                <p style={{ color: '#ffb3b3', marginBottom: '1rem' }}>
                    {message}
                </p>
            )}

            <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <label
                    htmlFor="register-username"
                    style={{ color: '#d8e7ff', fontWeight: 500 }}
                >
                    <span className={styles.required}>*</span>
                    Användarnamn
                </label>
                <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>

            <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <label
                    htmlFor="register-firstname"
                    style={{ color: '#d8e7ff', fontWeight: 500 }}
                >
                    <span className={styles.required}>*</span>
                    Förnamn
                </label>
                <input
                    id="register-firstname"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>

            <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <label
                    htmlFor="register-lastname"
                    style={{ color: '#d8e7ff', fontWeight: 500 }}
                >
                    <span className={styles.required}>*</span>
                    Efternamn
                </label>
                <input
                    id="register-lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>

            <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <label
                    htmlFor="register-email"
                    style={{ color: '#d8e7ff', fontWeight: 500 }}
                >
                    <span className={styles.required}>*</span>
                    E-post
                </label>
                <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                    autoComplete="email"
                />
            </div>

            <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <label
                    htmlFor="register-password"
                    style={{ color: '#d8e7ff', fontWeight: 500 }}
                >
                    <span className={styles.required}>*</span>
                    Lösenord
                </label>
                <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                    autoComplete="new-password"
                />
            </div>

            <button
                type="submit"
                className={styles.toggleButton}
                style={{ width: '100%', marginTop: '0.5rem' }}
            >
                Registrera
            </button>
        </form>
    );
};

export default RegisterForm;
