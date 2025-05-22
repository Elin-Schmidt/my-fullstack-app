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
    const [extraMenuOpen, setExtraMenuOpen] = useState(false);
    const { isLoggedIn } = useAuthContext();
    const [clockOpen, setClockOpen] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const extraMenuRef = useRef<HTMLLIElement | null>(null);
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
            if (
                extraMenuRef.current &&
                !extraMenuRef.current.contains(event.target as Node)
            ) {
                setExtraMenuOpen(false);
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
                                <li
                                    ref={extraMenuRef}
                                    className={styles.extraMenu}
                                >
                                    <button
                                        className={styles.extraButton}
                                        onClick={() =>
                                            setExtraMenuOpen((prev) => !prev)
                                        }
                                    >
                                        Extra Link 2{' '}
                                        <span className={styles.arrow}>
                                            {extraMenuOpen ? '▲' : '▶'}
                                        </span>
                                    </button>

                                    {extraMenuOpen && (
                                        <ul className={styles.expandMenu}>
                                            <li>Suboption A</li>
                                            <li>Suboption B</li>
                                            <li>Suboption C</li>
                                        </ul>
                                    )}
                                </li>

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
