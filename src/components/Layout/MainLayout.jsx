import Header from "../Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

function MainLayout({ children }) {
    return (
        <div className={styles.container}>
            <Sidebar />

            <div className={styles.content}>
                <Header />

                <main className={styles.main}>
                    {children}
                </main>
            </div>

        </div>
    );

}

export default MainLayout;