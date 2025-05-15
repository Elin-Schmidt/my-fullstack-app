import { createContext, useContext, useState, useEffect } from 'react';

// Skapa en ny kontext för inloggningsstatus
interface AppContextType {
    menuOpen: boolean;
    toggleMenu: () => void;
    isLoggedIn: boolean; // Här lagras inloggningsstatus
    setLoginStatus: (status: boolean) => void; // För att uppdatera status
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error(
            'useAppContext måste användas inom en AppContext.Provider'
        );
    }
    return context;
};

export const AppProvider: React.FC<React.PropsWithChildren<object>> = ({
    children
}) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        // Läs från localStorage vid första render
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const setLoginStatus = (status: boolean) => {
        setIsLoggedIn(status);
        if (status) {
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            localStorage.removeItem('isLoggedIn');
        }
    };

    return (
        <AppContext.Provider
            value={{ menuOpen, toggleMenu, isLoggedIn, setLoginStatus }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAuthContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error(
            'useAuthContext måste användas inom en AppContext.Provider'
        );
    }
    return context;
};
