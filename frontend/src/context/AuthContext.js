import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

const refreshToken = async (oldToken) => {
    try {
        const response = await axios.post('http://localhost:8001/api/auth/refresh_token', {oldToken: oldToken});
        return response.data.access_token
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

const setupAxiosInterceptors = (logout) => {
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response.status === 401) {
                toast.error('Ваша сессия истекла, перезайдите в систему!')
                logout();
            }
            return Promise.reject(error);
        }
    )
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken);
            setIsAuthenticated(true);
        }

        setupAxiosInterceptors(logout);

        const refreshTokenInterval = async () => {
            if (token && isTokenExpired(token)) {
                try {
                    const newToken = await refreshToken(token);
                    setToken(newToken);
                    localStorage.setItem('authToken', newToken);
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    logout();
                }
            }
        };

        const intervalId = setInterval(refreshTokenInterval, 3300 * 1000);

        return () => {
            clearInterval(intervalId);
            axios.interceptors.request.eject();
            axios.interceptors.response.eject();
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8001/api/auth/login', {
                email,
                password
            });
            if (response.status === 200) {
                const { access_token } = response.data;
                setToken(access_token)
                localStorage.setItem('authToken', access_token);
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

    const logout = async () => {
        try {
            await axios.post('http://localhost:8001/api/auth/logout', { token }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('authToken');
            toast.success('Вы успешно вышли из системы!');
        } catch (error) {
            console.error('Failed to logout:', error)
            toast.error('Произошла внутренняя ошибка, мы уже чиним!')
        }
        
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}; 