import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Container from "./Container";
import ProfileImage from "./ProfileImage";
import Form from "./Form";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";



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
