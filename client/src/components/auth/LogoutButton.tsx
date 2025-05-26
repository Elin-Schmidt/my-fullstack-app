// src/components/LogoutButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/LoginHandler.tsx'; // Din kontext
import { BiLogOut } from 'react-icons/bi'; // Byt ut FiLogOut mot MdLogout
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
            <BiLogOut className={styles.icon} />
            Logga ut
        </button>
    );
};

export default LogoutButton;
