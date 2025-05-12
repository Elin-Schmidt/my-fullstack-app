import { useRef, useEffect, useState } from 'react';
import { RxAvatar } from 'react-icons/rx';
import { FaTimes } from 'react-icons/fa';
import { FiClock, FiSearch } from 'react-icons/fi';
import { useNavbarContext } from '../../../context/NavbarHandeler.tsx';
import styles from './NavbarDesktop.module.css';
import DigitalClock from '../DigitalClock.tsx';
import { Link } from 'react-router-dom';

function NavbarDesktop() {
    // Använd kontexten istället för lokal state
    const { menuOpen, toggleMenu } = useNavbarContext(); // Hämtar menuOpen och toggleMenu från kontexten
    const [clockOpen, setClockOpen] = useState<boolean>(false);

    // Ref-typer
    const menuRef = useRef<HTMLDivElement | null>(null);
    const clockRef = useRef<HTMLDivElement | null>(null);

    // Event handler för att stänga menyn och klockan om användaren klickar utanför
    const handleClickOutside = (event: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
        ) {
            toggleMenu(); // Använd toggleMenu från kontexten
        }
        if (
            clockRef.current &&
            !clockRef.current.contains(event.target as Node)
        ) {
            setClockOpen(false);
        }
    };

    // Lägg till event listener vid mount och ta bort den vid unmount
    useEffect(() => {
        document.addEventListener(
            'mousedown',
            handleClickOutside as EventListener
        );
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [toggleMenu]);

    return (
        <nav className={styles['navbar-desktop']}>
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
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </div>

            <div className={styles.profileContainer}>
                <div className={styles.searchContainer}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.searchBar}
                    />
                </div>
                <button className={styles.profile} onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <RxAvatar />}
                </button>
                {menuOpen && (
                    <>
                        <div
                            className={styles.overlay}
                            onClick={toggleMenu} // Stäng menyn när overlay klickas
                        ></div>
                        <div
                            ref={menuRef}
                            className={`${styles.flyoutMenu} ${menuOpen ? styles.open : ''}`}
                        >
                            <ul>
                                <li>Extra Link 1</li>
                                <li>Extra Link 2</li>
                                <li>Extra Link 3</li>
                                <li>Extra Link 4</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavbarDesktop;
