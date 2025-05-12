import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAppContext } from './LoginHandeler.tsx';

// Definiera typen för kontextens värde
interface useNavbarContextType {
    menuOpen: boolean;
    toggleMenu: () => void;
}

// Skapa kontexten
const NavbarContext = createContext<useNavbarContextType | undefined>(
    undefined
);

// Skapa en provider-komponent
export const NavbarProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <NavbarContext.Provider value={{ menuOpen, toggleMenu }}>
            {children}
        </NavbarContext.Provider>
    );
};

// Anpassad hook för att använda kontexten
export const useNavbarContext = () => {
    const context = useContext(NavbarContext);
    if (!context) {
        console.error(
            'useNavbarContext måste användas inom en NavbarContext.Provider'
        );
        throw new Error(
            'useNavbarContext måste användas inom en NavbarContext.Provider'
        );
    }
    return context;
};
