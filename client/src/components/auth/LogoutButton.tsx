// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/LoginHandler.tsx'; // Din kontext
import { FiLogOut } from 'react-icons/fi';
import styles from './LogoutButton.module.css'; // Importera din CSS-modul

const LogoutButton = () => {
    const { setLoginStatus } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Ta bort token och användardata från localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');

        // Uppdatera login-status i context
        setLoginStatus(false);

        // Navigera till login-sidan eller annan sida
        navigate('/');
    };

    return (
        <button className={styles.logoutButton} onClick={handleLogout}>
            <FiLogOut className={styles.icon} />
            Logga ut
        </button>
    );
};

export default LogoutButton;
