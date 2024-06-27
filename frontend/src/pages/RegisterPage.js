import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"

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
    const [repeatPassword, setRepeatPassword] = useState('')
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            toast.error('Пароли не совпадают!')
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async () => {
            const imageBase64 =reader.result;

            const data = {
                username,
                password,
                email,
                image: imageBase64,
            };

            try {
                await axios.post('http://localhost:8001/api/user/create_user', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                toast.success('Регистрация прошла успешно!')
                await login(email, password)
                navigate('/posts')
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    toast.error('Этот email уже зарегестрирован.')
                } else {
                    toast.error('Произошла ошибка. Попробуйте позже')
                }
            }
        };

        if (image) {
            reader.readAsDataURL(image);
        } else {
            const data = {
                username,
                password,
                email
            };

            try {
                await axios.post('http://localhost:8001/api/user/create_user', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                toast.success('Регистрация прошла успешно!');
                await login(email, password)
                navigate('/posts');
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    toast.error('Этот email уже зарегестрирован.')
                } else {
                    toast.error('Произошла ошибка. Попробуйте позже')
                }
            }
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
                    type="password"
                    placeholder="Повторите пароль"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
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