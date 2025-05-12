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

        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });

            if (response.status === 200) {
                // Här förutsätter vi att ditt svar innehåller en JWT-token och användardata
                const { token, user } = response.data;

                // ✅ Spara token och användardata i localStorage
                localStorage.setItem('token', token); // Spara token
                localStorage.setItem('user', JSON.stringify(user)); // Spara användardata

                // Uppdatera login-status i context
                setLoginStatus(true);

                // Navigera till startsidan eller annan sida efter lyckad inloggning
                navigate('/'); // Använd rätt URL som du vill navigera till
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Fel e-post eller lösenord.');
            } else {
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
