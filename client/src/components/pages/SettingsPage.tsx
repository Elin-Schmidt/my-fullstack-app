// src/pages/SettingsPage.tsx
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAuthContext } from '@/context/LoginHandler.tsx';

interface FormData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    aboutMe: string;
}

export default function SettingsPage() {
    const { user } = useAuthContext();

    // Om ingen användare är inloggad → skicka till login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userId = user.id.toString();

    const [formData, setFormData] = useState<FormData>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        aboutMe: ''
    });

    const [showBio, setShowBio] = useState<boolean>(false);

    // Hämta befintlig data när vi vet userId
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/users/${userId}`
                );
                const data = response.data;
                setFormData({
                    username: data.username || '',
                    firstName: data.firstname || '',
                    lastName: data.lastname || '',
                    email: data.email || '',
                    aboutMe: data.bio || ''
                });
            } catch (err) {
                console.error('Kunde inte hämta användardata:', err);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Grundläggande validering
        if (!formData.username || !formData.email) {
            alert('Fyll i både användarnamn och e-mail.');
            return;
        }

        const updateData = {
            username: formData.username,
            firstname: formData.firstName,
            lastname: formData.lastName,
            email: formData.email,
            bio: formData.aboutMe
        };

        try {
            const response = await axios.put(
                `http://localhost:5000/api/users/${userId}`,
                updateData
            );

            if (response.status === 200) {
                alert('Informationen har uppdaterats!');
            } else {
                alert('Något gick fel vid uppdateringen.');
            }
        } catch (error) {
            console.error('Fel vid uppdatering:', error);
            alert('Ett fel uppstod när informationen skulle skickas.');
        }
    };

    return (
        <div className="settings-page p-4">
            <div className="bioWrapper">
                <button
                    className="flex items-center gap-2 mb-2"
                    onClick={() => setShowBio((prev) => !prev)}
                    type="button"
                >
                    {showBio ? <ChevronDown /> : <ChevronRight />}
                    <span className="font-semibold">Bio</span>
                </button>

                {showBio && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <label htmlFor="username">
                            Användarnamn:
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Användarnamn"
                                required
                            />
                        </label>

                        <label htmlFor="firstName">
                            Förnamn:
                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Förnamn"
                            />
                        </label>

                        <label htmlFor="lastName">
                            Efternamn:
                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Efternamn"
                            />
                        </label>

                        <label htmlFor="email">
                            E-mail:
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exempel@mail.com"
                                required
                            />
                        </label>

                        <label htmlFor="aboutMe">
                            Om mig:
                            <textarea
                                id="aboutMe"
                                name="aboutMe"
                                value={formData.aboutMe}
                                onChange={handleChange}
                                placeholder="Skriv något om dig själv..."
                            />
                        </label>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Spara ändringar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
