import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../auth/TokenService.ts';

const ProtectedRoute = () => {
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
