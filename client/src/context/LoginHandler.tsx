import { createContext, useContext, useState } from 'react';

// Skapa en ny kontext för inloggningsstatus
interface AppContextType {
    menuOpen: boolean;
    toggleMenu: () => void;
    isLoggedIn: boolean; // Här lagras inloggningsstatus
    setLoginStatus: (status: boolean) => void; // För att uppdatera status

    user: User | null; // <-- lägg till user
    setUser: (user: User | null) => void; // <-- och setUser
}

interface User {
    id: number;
    username: string;
    email: string;
    // ev fler fält beroende på vad du sparar i user-objektet
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
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const setLoginStatus = (status: boolean) => {
        setIsLoggedIn(status);
        if (!status) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AppContext.Provider
            value={{
                menuOpen,
                toggleMenu,
                isLoggedIn,
                setLoginStatus,
                user,
                setUser
            }}
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
