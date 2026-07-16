import {createContext, useContext,useState, } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const signIn = async (email, password) => {
    try {
      const response = await authService.Login(email, password);
        setUser(response.user);
    } catch (error) {
      throw error;
    }
    };
}