import React, { useState, useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Button from "../../components/LoginPage/Button";
import Container from "../../components/LoginPage/Container";
import Title from "../../components/LoginPage/Title";
import Input from "../../components/LoginPage/Input";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            toast.error('Произошла внутрення ошибка')
            console.log(error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/posts');
        }
    }, [isAuthenticated, navigate])

    return (
        <Container>
            <Title>Авторизация</Title>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Войти</Button>
            </form>
            <p>
                Нет аккаунта? <Link to="/register">Регистрация</Link>
            </p>
        </Container>
    )
}

export default LoginPage;