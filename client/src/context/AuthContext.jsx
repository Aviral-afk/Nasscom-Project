import { createContext, useContext, useState } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hotelpro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hotelpro_token') || null);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('hotelpro_token', receivedToken);
    localStorage.setItem('hotelpro_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (name, email, password, role = 'guest') => {
    const res = await API.post('/auth/register', { name, email, password, role });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('hotelpro_token', receivedToken);
    localStorage.setItem('hotelpro_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('hotelpro_token');
    localStorage.removeItem('hotelpro_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
