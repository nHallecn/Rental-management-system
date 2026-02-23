"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('bantus-token');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser({ ...decodedUser, token });
    }
  }, []);

  const login = async (username, password) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // --- THIS IS THE CORRECTED URL ---
    const response = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
    // --------------------------------

    const { token } = response.data;
    localStorage.setItem('bantus-token', token);
    const decodedUser = jwtDecode(token);
    setUser({ ...decodedUser, token });

    // Redirect based on role
    if (decodedUser.role === 'landlord') {
      router.push('/landlord/dashboard');
    } else if (decodedUser.role === 'tenant') {
      router.push('/tenant/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('bantus-token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
