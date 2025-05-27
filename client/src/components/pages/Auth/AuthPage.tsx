import { FaUserCircle } from 'react-icons/fa';

import LoginForm from '../../auth/LoginForm.tsx';
import RegisterForm from '../../auth/RegisterForm.tsx';
import styles from './AuthPage.module.css';

const AuthPage = () => {
    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <FaUserCircle
                    size={48}
                    color="#d8e7ff"
                    style={{ marginBottom: '0.5rem' }}
                />
                <h1 className={styles.authTitle}>Välkommen</h1>
                <p className={styles.welcomeText}>
                    Välkommen tillbaka! Logga in för att fortsätta.
                </p>
                <LoginForm />
                <div className={styles.divider}>eller</div>
                <RegisterForm />
            </div>
        </div>
    );
};

export default AuthPage;
