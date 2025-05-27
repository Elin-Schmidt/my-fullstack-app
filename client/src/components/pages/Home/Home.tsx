import styles from './Home.module.css';

function Home() {
    return (
        <div className={styles.homeContainer}>
            <div className={styles.homeOverlay}></div>
            <div className={styles.contentBox}>
                <h1 className={styles.title}>Välkommen till </h1>
                <img
                    src="/images/default_cover.png"
                    alt="Välkomstbild"
                    className={styles.welcomeImage}
                />
                <p className={styles.subtitle}>
                    <p>En plats för kod, kreativitet och gemenskap.</p>
                    <p>Skapa din profil, dela inlägg och upptäck nya vänner!</p>
                </p>
            </div>
        </div>
    );
}

export default Home;
