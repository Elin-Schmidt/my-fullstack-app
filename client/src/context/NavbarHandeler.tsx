import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definiera typen för kontextens värde
interface AppContextType {
    menuOpen: boolean;
    toggleMenu: () => void;
}

// Skapa kontexten
const AppContext = createContext<AppContextType | undefined>(undefined);

// Skapa en provider-komponent
export const AppProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <AppContext.Provider value={{ menuOpen, toggleMenu }}>
            {children}
        </AppContext.Provider>
    );
};

// Anpassad hook för att använda kontexten
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
