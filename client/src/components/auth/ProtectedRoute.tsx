// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../auth/TokenService.ts'; // Importera token-service

const ProtectedRoute = () => {
    const token = getToken();

    // Om ingen token finns, navigera till login-sidan
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Om token finns, rendera den skyddade sidan
    return <Outlet />;
};

export default ProtectedRoute;
