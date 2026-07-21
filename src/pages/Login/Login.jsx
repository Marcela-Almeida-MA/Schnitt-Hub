import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import MainLayout from "../../components/Layout/MainLayout";


function Login() {

    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await signIn(email, password);
    } catch (error) {
        console.error(error);
        alert("E-mail ou senha inválidos.");
    }
};

    
    return (
       < MainLayout>
        <div>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input 
            type="password" 
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">
                Entrar
            </button>
        
        </form>
        </div>
    </MainLayout>
    );
}

export default Login;