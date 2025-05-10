import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './index.css';
import { AppProvider } from './context/NavbarHandeler';
import NavbarDesktop from './components/layout/Navbar/NavbarDesktop';
import NavbarMobile from './components/layout/Navbar/NavbarMobile';

const App: React.FC = () => {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = (): void => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return (): void => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <AppProvider>
            <Router>
                {isMobile ? <NavbarMobile /> : <NavbarDesktop />}
                <AppRoutes />
            </Router>
        </AppProvider>
    );
};

export default App;
