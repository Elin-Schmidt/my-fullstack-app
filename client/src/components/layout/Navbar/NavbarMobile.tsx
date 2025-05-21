import { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/LoginHandler.tsx';
import { useNavbarContext } from '../../../context/NavbarHandler.tsx';
import styles from './NavbarMobile.module.css';
import DigitalClock from '../DigitalClock.tsx';
import LogoutButton from '../../auth/LogoutButton.tsx';

function NavbarMobile() {
    const { menuOpen, toggleMenu } = useNavbarContext();
    const { isLoggedIn } = useAuthContext();
    const [clockOpen, setClockOpen] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const clockRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                toggleMenu();
            }
            if (
                clockRef.current &&
                !clockRef.current.contains(event.target as Node)
            ) {
                setClockOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [toggleMenu]);

    const handleProfileClick = () => {
        if (isLoggedIn) {
            toggleMenu();
        } else {
            navigate('/auth');
        }
    };

    return (
        <nav className={styles['navbar-mobile']}>
            <div className={styles.clock} ref={clockRef}>
                <button
                    className={styles.clockButton}
                    onClick={() => setClockOpen((prev) => !prev)}
                >
                    <FiClock />
                </button>
                {clockOpen && (
                    <div className={styles.flyoutClock}>
                        <DigitalClock />
                    </div>
                )}
            </div>

            <div className={styles.wrapper}>
                <ul className={styles.links}>
                    <li onClick={() => navigate('/')}>Home</li>
                    <li>About</li>
                    <li>Services</li>
                    <li>Contact</li>
                </ul>
            </div>

            <div className={styles.profileContainer}>
                <button className={styles.profile} onClick={handleProfileClick}>
                    {menuOpen && isLoggedIn ? <FaTimes /> : <RxAvatar />}
                </button>

                {menuOpen && isLoggedIn && (
                    <>
                        <div
                            className={styles.overlay}
                            onClick={toggleMenu}
                        ></div>
                        <div
                            ref={menuRef}
                            className={`${styles.flyoutMenu} ${menuOpen ? styles.open : ''}`}
                        >
                            <ul>
                                <li onClick={() => navigate('/personal-space')}>
                                    Min sida
                                </li>
                                <li>Extra Link 2</li>
                                <li onClick={() => navigate('/settings')}>
                                    Inställningar
                                </li>
                                <li>
                                    <LogoutButton />
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavbarMobile;
