// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/LoginHandeler.tsx'; // Din kontext

const LogoutButton = () => {
    const { setLoginStatus } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Ta bort token och användardata från localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Uppdatera login-status i context
        setLoginStatus(false);

        // Navigera till login-sidan eller annan sida
        navigate('/');
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
            Logga ut
        </button>
    );
};

export default LogoutButton;
