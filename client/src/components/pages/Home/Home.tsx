import styles from './Home.module.css';

function Home() {
    return (
        <div className={styles.homeContainer}>
            <div className={styles.overlay}>
                <div className={styles.contentBox}>
                    <h1 className={styles.title}>Välkommen till </h1>
                    <img
                        src="/images/default_cover.png"
                        alt="Välkomstbild"
                        className={styles.welcomeImage}
                    />
                    <p className={styles.subtitle}>
                        En plats för kod, kreativitet och gemenskap.
                        <br />
                        Skapa din profil, dela inlägg och upptäck nya vänner!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
