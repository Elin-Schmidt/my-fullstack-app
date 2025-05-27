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
                    <p>
                        En plats där du kan dela dina tankar, läsa andras
                        berättelser och hitta nya vänner genom ord.
                    </p>
                    ---
                    <p>Skapa din profil och bli en del av gemenskapen!</p>
                </p>
            </div>
        </div>
    );
}

export default Home;
