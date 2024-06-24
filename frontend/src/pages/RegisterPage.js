import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Link} from "react-router-dom"

const RegisterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
`;

const RegisterForm = styled.form`
    display: flex;
    flex-direction: column;
    background: white;
    padding: 48px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    max-width: 400px;
    width: 100%;
`;

const RegisterTitle = styled.h2`
    margin-bottom: 20px;
    text-align: center;
`;

const Input = styled.input`
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('http://localhost:8001/api/user/create_user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Регистрация прошла успешно!')
            await login(username, password);
        } catch (error) {
            toast.error('Произошла ошибка. Попробуйте попозже.');
        }
    };

    return (
        <RegisterContainer>
            <RegisterTitle>Регистрация</RegisterTitle>
            <RegisterForm onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Input
                    type="email"
                    placeholder="Электронная почта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <Button type="submit">Регистрация</Button>
                <p>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </RegisterForm>
        </RegisterContainer>
    )
}

export default RegisterPage;