import chasedImg from '@/assets/chased-preview.jfif';
import styles from './ExternalRedirectChased.module.css';

const ExternalRedirectChased = () => {
    return (
        <div className={styles.chasedContainer}>
            <h1 className={styles.chasedTitle}>
                Chased
                <span role="img" aria-label="joystick">
                    🕹️
                </span>
            </h1>
            <span className={styles.chasedBadge}>Skapat av Elin Schmidt</span>
            <p className={styles.chasedFirstParagraph}>
                Chased är ett enkelt och roligt spel där du ska undvika att bli
                jagad av fiender så länge som möjligt.
            </p>
            <p className={styles.chasedSecondParagraph}>
                Jag skapade spelet <b>Chased</b> på bara 6 timmar i MakeCode
                Arcade – mitt första spelprojekt utan förkunskaper. Under
                processen lärde jag mig snabbt nya tekniker och tillämpade dem
                för att skapa ett engagerande och utmanande spel. Det var en
                fantastisk möjlighet att växa och utvecklas inom spelutveckling,
                och resultatet visar på min passion för att lära och skapa!
            </p>
            <img
                src={chasedImg}
                alt="Förhandsvisning av Chased-spelet"
                className={styles.chasedImage}
            />
            <p>
                <a
                    href="https://elin-schmidt.github.io/chased/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.chasedButton}
                >
                    🎮 Spela Chased (öppnas i ny flik)
                </a>
            </p>
        </div>
    );
};

export default ExternalRedirectChased;
