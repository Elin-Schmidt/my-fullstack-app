import { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { FiClock } from 'react-icons/fi';
import { useAppContext } from '../../../context/NavbarHandeler'; // Importera kontexten
import styles from './NavbarMobile.module.css';
import DigitalClock from '../DigitalClock';

function NavbarMobile() {
    // Använd kontexten istället för lokal state
    const { menuOpen, toggleMenu } = useAppContext(); // Hämtar menuOpen och toggleMenu från kontexten
    const [clockOpen, setClockOpen] = useState<boolean>(false);

    // Ref-typer för att hantera DOM-elementen
    const menuRef = useRef<HTMLDivElement | null>(null);
    const clockRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Kontrollera om klicket är utanför menyn
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                toggleMenu(); // Använd toggleMenu från kontexten
            }
            // Kontrollera om klicket är utanför klockan
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
                    <li>Home</li>
                    <li>About</li>
                    <li>Services</li>
                    <li>Contact</li>
                </ul>
            </div>

            <div className={styles.profileContainer}>
                <button className={styles.profile} onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <RxAvatar />}
                </button>
                {menuOpen && (
                    <>
                        <div
                            className={styles.overlay}
                            onClick={() => toggleMenu()} // Stäng menyn när overlay klickas
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

export default NavbarMobile;
