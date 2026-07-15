import Header from "../Header";
import Sidebar from "../Sidebar"
import styles from "../Layout.module.css"

function Layout ({ children }) {
    return(
        <div className={styles.container}>
            <Sidebar />

        <div className={styles.content}>  
            <Header/>

         <main className={styles.main}>
            {children}  

        </main>
        </div>
        </div>
    );
}

export default Layout;