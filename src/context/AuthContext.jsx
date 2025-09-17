import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Check if token is expired
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decoded.exp && decoded.exp < currentTime) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            setUser(decoded);
          }
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error('Token is expired');
      }
      localStorage.setItem('token', token);
      setUser(decoded);
    } catch (err) {
      console.error('Login failed:', err);
      localStorage.removeItem('token');
      setUser(null);
      throw err; // Let calling component handle the error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};