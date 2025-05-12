import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/pages/Home.tsx';
import LoginForm from '../components/auth/LoginForm.tsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.tsx';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
