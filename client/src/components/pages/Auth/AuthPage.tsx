import { useState } from 'react';
import LoginForm from '../../auth/LoginForm.tsx';
import RegisterForm from '../../auth/RegisterForm.tsx';
import './AuthPage.module.css'; // Importera CSS för AuthPage

const AuthPage = () => {
    const [showRegister, setShowRegister] = useState(false);

    const toggleRegisterForm = () => {
        setShowRegister((prev) => !prev);
    };

    return (
        <div className="auth-page">
            <h1>Välkommen</h1>
            <div className="form-container">
                <LoginForm />
            </div>
            <div className="form-container">
                <button onClick={toggleRegisterForm}>
                    {showRegister
                        ? 'Stäng registreringsformulär'
                        : 'Registrera dig'}
                </button>
                {showRegister && (
                    <div className="register-form">
                        <RegisterForm />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
