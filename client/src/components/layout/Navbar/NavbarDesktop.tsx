import { useRef, useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/LoginHandler.tsx';
import styles from './NavbarDesktop.module.css';
import DigitalClock from '../DigitalClock.tsx';
import LogoutButton from '../../auth/LogoutButton.tsx';

function NavbarDesktop() {
    const { isLoggedIn } = useAuthContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [extraMenuOpen, setExtraMenuOpen] = useState(false);
    const [clockOpen, setClockOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);
    const extraMenuRef = useRef<HTMLLIElement | null>(null);
    const clockRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
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
    }, [menuOpen]);

    const handleProfileClick = () => {
        if (isLoggedIn) {
            setMenuOpen((prev) => !prev);
        } else {
            navigate('/auth');
        }
    };

    return (
        <nav
            className={styles['navbar-mobile']}
            style={{ position: 'fixed', top: 0, bottom: 'unset' }}
        >
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
                <ul className={styles.bottomLinks}>
                    <span className={styles.linksDivider}></span>
                    <li onClick={() => navigate('/')}>Home</li>
                    <span className={styles.linksDivider}></span>
                    <li onClick={() => navigate('/chased')}>Chased (Spel)</li>
                    <span className={styles.linksDivider}></span>
                </ul>
            </div>

            <div className={styles.profileContainer}>
                <button
                    aria-label="Profilmeny"
                    className={styles.profile}
                    onClick={handleProfileClick}
                >
                    {menuOpen && isLoggedIn ? <FaTimes /> : <RxAvatar />}
                </button>

                {menuOpen && isLoggedIn && (
                    <>
                        <div
                            className={styles.overlay}
                            onClick={() => setMenuOpen(false)}
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
                                        className={`${styles.extraButton} ${extraMenuOpen ? styles.expanded : ''}`}
                                        onClick={() =>
                                            setExtraMenuOpen((prev) => !prev)
                                        }
                                    >
                                        Extra alternativ
                                        <span className={styles.arrow}>
                                            {extraMenuOpen ? '▼' : '▶'}
                                        </span>
                                    </button>

                                    {extraMenuOpen && (
                                        <ul className={styles.expandMenu}>
                                            <li
                                                onClick={() =>
                                                    navigate('/messages')
                                                }
                                            >
                                                Meddelanden
                                            </li>
                                            <li
                                                onClick={() =>
                                                    navigate('/notebook')
                                                }
                                            >
                                                Notebook
                                            </li>
                                            <li
                                                onClick={() =>
                                                    navigate('/to-do')
                                                }
                                            >
                                                To-Do Lista
                                            </li>
                                        </ul>
                                    )}
                                </li>
                                <li onClick={() => navigate('/all-users')}>
                                    Alla användare
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

export default NavbarDesktop;
