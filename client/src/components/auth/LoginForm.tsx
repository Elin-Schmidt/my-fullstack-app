import { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/LoginHandeler.tsx'; // Din kontext
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const { setLoginStatus } = useAppContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        console.log('Inloggningsuppgifter:', { email, password });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );

            if (response.status === 200) {
                console.log('Login Successful'); // Logga vid lyckad inloggning
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setLoginStatus(true);
                navigate('/personal-space'); // Navigera till personlig sida
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                console.log('Login Failed'); // Logga vid misslyckad inloggning
                setError('Fel e-post eller lösenord.');
            } else {
                console.log('Login Failed: Server error'); // Logga vid serverfel
                setError('Ett fel uppstod. Försök igen senare.');
            }
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            className="max-w-md mx-auto p-6 bg-white shadow rounded"
        >
            <h2 className="text-2xl font-semibold mb-4">Logga in</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}

            <label className="block mb-2">
                E-post
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </label>

            <label className="block mb-4">
                Lösenord
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </label>

            <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
            >
                Logga in
            </button>
        </form>
    );
};

export default LoginForm;
