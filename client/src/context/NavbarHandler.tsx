import React, { createContext, useContext, useState, ReactNode } from 'react';

interface useNavbarContextType {
    menuOpen: boolean;
    toggleMenu: () => void;
}

const NavbarContext = createContext<useNavbarContextType | undefined>(
    undefined
);

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
