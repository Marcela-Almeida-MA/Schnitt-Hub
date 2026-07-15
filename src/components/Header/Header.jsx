import styles from "./Header.module.css";

function Header() {
    return (
        <header className={styles.header}>
            <h2>Schnitt Hub</h2>

            <div className={styles.user}>
                Marcela
            </div>
        </header>
    );
}
export default Header;