import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Set token in header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Fetch user details locally or from API if needed. 
            // For now, let's try to get current user from API to validate token
            api.get('/users/me/')
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(() => {
                    // Token invalid
                    logout();
                    setLoading(false);
                });
        } else {
            delete api.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/token', formData);
        const accessToken = response.data.access_token;

        localStorage.setItem('token', accessToken);
        setToken(accessToken);
    };

    const register = async (email, password) => {
        await api.post('/users/', { email, password });
        // Auto login after register? Or redirect to login. Let's redirect to login for now (handled in component)
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
