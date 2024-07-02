import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import { toast } from "react-toastify";

const Container = styled.div`
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f4f4f4;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
        max-width: 90%;
        padding: 15px;
    }
`;

const ProfileImage = styled.img`
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        width: 80px;
        height: 80px;
    }
`;

const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 1rem;
    width: 100%;

    @media (max-width: 768px) {
        padding: 8px;
        font-size: 0.9rem;
    }
`;

const TextArea = styled.textarea`
    padding: 10px;
    font-size: 1rem;
    resize: none;
    width: 100%;

    @media (max-width: 768px) {
        padding: 8px;
        font-size: 0.9rem;
    }
`;

const Button = styled.button`
    padding: 10px;
    background: #333;
    color: #fff;
    border: none;
    cursor: pointer;

    &:hover {
        background: #555;
    }

    @media (max-width: 768px) {
        padding: 8px;
    }
`;

const UserProfile = () => {
    const { user, token, logout } = useAuth();
    const [formData, setFormData] = useState({
        image: user?.image || "",
        username: user?.username || "",
        email: user?.email || "",
        description: user?.description || ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                image: user.image,
                username: user.username,
                email: user.email,
                description: user.description
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                image: reader.result
            });
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                "http://localhost:8001/api/user/update-user",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.status === 200) {
                toast.success("Информация обновлена успешно!")
            }
        } catch (error) {
            toast.error("Ошибка при обновлении информации");
            if (error.response && error.response.status === 401) {
                logout()
            }
        }

       
    };

    return (
        <Container>
            <h2>Личный кабинет</h2>
            <ProfileImage src={formData.image} alt="profile" />
            <Form onSubmit={handleSubmit}>
                <label>
                    <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                <label>
                    Имя пользователя:
                    <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Email:
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Описание:
                    <TextArea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                <Button type="submit">Сохранить изменения</Button>
            </Form>
        </Container>
    );
};

export default UserProfile;
