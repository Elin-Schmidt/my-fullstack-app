import { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/LoginHandler.tsx';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@utils/api.ts';
import styles from '../pages/Auth/AuthPage.module.css';

const LoginForm = () => {
    const { setLoginStatus, setUser } = useAppContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/login`,
                { email, password }
            );

            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');
                setLoginStatus(true);
                setUser(user);
                navigate('/personal-space');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setError('Fel e-post eller lösenord.');
                } else {
                    setError('Ett fel uppstod. Försök igen senare.');
                }
            } else {
                setError('Ett okänt fel uppstod.');
            }
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            className={styles.formContainer}
            autoComplete="on"
        >
            <h2
                style={{
                    color: '#d8e7ff',
                    fontWeight: 600,
                    fontSize: '1.6rem',
                    marginBottom: '1.2rem'
                }}
            >
                Logga in
            </h2>
            {error && (
                <p style={{ color: '#ffb3b3', marginBottom: '1rem' }}>
                    {error}
                </p>
            )}

            <div style={{ width: '100%', marginBottom: '1.2rem' }}>
                <label
                    htmlFor="login-email"
                    style={{ color: '#d8e7ff', fontWeight: 500 }}
                >
                    E-post
                </label>
                <input
                    id="login-email"
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
                    htmlFor="login-password"
                    style={{ color: '#d8e7ff', fontWeight: 500 }}
                >
                    Lösenord
                </label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                    autoComplete="current-password"
                />
            </div>

            <button
                type="submit"
                className={styles.toggleButton}
                style={{ width: '100%', marginTop: '0.5rem' }}
            >
                Logga in
            </button>
        </form>
    );
};

export default LoginForm;
