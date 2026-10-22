import { useState } from "react";
import { AuthContext } from "./auth-context.js";
import * as auth from "../services/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Autentica o usuário e armazena os dados retornados pela API.
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