import styles from "./Sidebar.module.css";

function Sidebar (){
return (
    <aside className={styles.sidebar}>
        <h2> Schnitt Hub</h2>

        <nav>
            <ul>
                <li> Dashboart </li>
                <li> Agenda </li>
                <li> Clientes </li>
                <li> Barbeiros </li>
                <li> Serviços </li>
                <li> Financeiro </li>
                <li> Relatorios </li>
                <li> Configurações</li>
            </ul>
        </nav>
    </aside>
);
}
export default Sidebar;