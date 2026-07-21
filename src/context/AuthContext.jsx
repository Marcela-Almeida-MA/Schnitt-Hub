import { createContext, useState } from "react";
import * as auth from "../services/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const signIn = async (email, password) => {
        const response = await auth.Login(email, password);
        setUser(response.user);
    };

    return (
        <AuthContext.Provider value={{ user, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}