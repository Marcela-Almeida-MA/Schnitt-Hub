import {userContext} from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  return userContext(AuthContext);
}
