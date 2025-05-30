import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/pages/Home/Home.tsx';
import AuthPage from '../components/pages/Auth/AuthPage.tsx';
import LoginForm from '../components/auth/LoginForm.tsx';
import RegisterForm from '../components/auth/RegisterForm.tsx';
import PersonalSpace from '@/components/pages/PersonalSpace/PersonalSpace.tsx';
import SettingsPage from '../components/pages/Settings/SettingsPage.tsx';
import AllUsers from '../components/pages/AllUsers/AllUsers.tsx';
import UserSpace from '../components/pages/UserSpace.tsx';
import Notebook from '../components/pages/Notebook/Notebook.tsx';
import ToDoList from '../components/pages/ToDoList/ToDoList.tsx';
import ExternalRedirectChased from '../components/pages/Chased/ExternalRedirectChased.tsx';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/personal-space" element={<PersonalSpace />} />
            <Route path="/notebook" element={<Notebook />} />
            <Route path="/to-do" element={<ToDoList />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/user/:id" element={<UserSpace />} />
            <Route path="/chased" element={<ExternalRedirectChased />} />
            {/* Lägg till fler rutter här */}
        </Routes>
    );
};

export default AppRoutes;
