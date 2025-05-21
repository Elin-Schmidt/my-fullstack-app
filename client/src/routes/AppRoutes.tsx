import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/pages/Home.tsx';
import AuthPage from '../components/pages/AuthPage.tsx';
import LoginForm from '../components/auth/LoginForm.tsx';
import RegisterForm from '../components/auth/RegisterForm.tsx';
import PersonalSpace from '@/components/pages/PersonalSpace.tsx';
import SettingsPage from '../components/pages/SettingsPage.tsx';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/personal-space" element={<PersonalSpace />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Lägg till fler rutter här */}
        </Routes>
    );
};

export default AppRoutes;
