import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/LoginHandler.tsx';
import { BiLogOut } from 'react-icons/bi';
import styles from './LogoutButton.module.css';

const LogoutButton = () => {
    const { setLoginStatus } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');

        setLoginStatus(false);

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
