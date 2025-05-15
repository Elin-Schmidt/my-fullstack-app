import { createContext, useContext, useState } from 'react';

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
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Default är inte inloggad

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const setLoginStatus = (status: boolean) => setIsLoggedIn(status);

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
