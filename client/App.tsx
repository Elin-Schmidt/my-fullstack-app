import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './src/routes/AppRoutes.tsx';
import '../client/src/index.css';
import { AppProvider } from './src/context/LoginHandeler.tsx';
import { NavbarProvider } from './src/context/NavbarHandeler.tsx';
import NavbarDesktop from './src/components/layout/Navbar/NavbarDesktop.tsx';
import NavbarMobile from './src/components/layout/Navbar/NavbarMobile.tsx';

const App = () => {
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
            <NavbarProvider>
                <Router>
                    {isMobile ? <NavbarMobile /> : <NavbarDesktop />}
                    <AppRoutes />
                </Router>
            </NavbarProvider>
        </AppProvider>
    );
};

export default App;
