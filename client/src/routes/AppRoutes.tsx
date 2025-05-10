import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/pages/Home';
import PersonalSpace from '../components/pages/PersonalSpace';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypage" element={<PersonalSpace />} />
        </Routes>
    );
};

export default AppRoutes;
