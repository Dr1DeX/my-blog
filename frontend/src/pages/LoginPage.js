import React, { useState, useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Container = styled.div`
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ddd;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

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