import { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
                {
                    username,
                    firstname,
                    lastname,
                    email,
                    password,
                    profile_picture: profilePicture || null
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
            className="max-w-md mx-auto p-6 bg-white shadow rounded"
        >
            <h2 className="text-2xl font-semibold mb-4">Registrera dig</h2>
            {message && <p className="text-red-600 mb-2">{message}</p>}

            <label className="block mb-2">
                Användarnamn
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </label>

            <label className="block mb-2">
                Förnamn
                <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </label>

            <label className="block mb-2">
                Efternamn
                <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </label>

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

            <label className="block mb-2">
                Lösenord
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </label>

            <label className="block mb-4">
                Profilbild (valfritt)
                <input
                    type="text"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="URL till profilbild"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </label>

            <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
            >
                Registrera
            </button>
        </form>
    );
};

export default RegisterForm;
