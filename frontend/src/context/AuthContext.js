import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8001/api/auth/login', {
                username,
                password
            });
            if (response.status === 200) {
                const { access_token } = response.data;
                setToken(access_token)
                await fetchUserData(access_token);
                setIsAuthenticated(true);
                toast.success('Авторизация прошла успешно!');
            }
        } catch (error) {
            toast.error('Неправильное имя пользователя или пароль');
        }
    }

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('http://localhost:8001/api/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user data', error)
        }
    }

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        toast.success('Вы успешно вышли из системы!')
        
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}; 