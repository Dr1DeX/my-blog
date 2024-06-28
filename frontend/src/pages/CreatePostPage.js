import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreatePostContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    padding: 20px
`;

const CreatePostForm = styled.form`
    display: flex;
    flex-direction: column;
    background: white;
    padding: 48px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;

    @media (max-width: 768px) {
        padding: 24px;
        box-shadow: none;
    }
`;

const FormTitle = styled.h2`
    margin-bottom: 20px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

const Input = styled.input`
    margin-bottom: 15px;
    padding: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;

    @media (max-width: 768px) {
        padding: 14px;
        font-size: 14px;
    }
`;

const TextArea = styled.textarea`
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    resize: none;

    @media (max-width) {
        padding: 14px;
        font-size: 14px;
    }
`;

const Select = styled.select`
    margin-bottom: 15px;
    padding: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;

    @media (max-width: 768px) {
        padding: 14px;
        font-size: 14px;
    }
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

    @media (max-width: 768px) {
        padding: 14px;
        font-size: 14px;
    }
`;

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8001/api/post/categories/all');
                setCategories(response.data);
            } catch (error) {
                toast.error('Не удалось загрузить категории. Попробуйте позже.')
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reader = new FileReader();

        reader.onloadend = async () => {
            const imageBase64 = reader.result;

            const data = {
                title,
                description,
                category_id: parseInt(category),
                image_url: imageBase64
            };

            try {
                await axios.post('http://localhost:8001/api/posts/create', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                toast.success('Пост успешно создан!');
                navigate('/posts');
            } catch (error) {
                toast.error('Произошла внутреняя ошибка. Попробуйте позже')
            }
        };

        if (image) {
            reader.readAsDataURL(image);
        } else {
            const data = {
                title,
                description,
                category_id: parseInt(category),
            };

            try {
                await axios.post('http://localhost:8001/api/post/create', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                toast.success('Пост успешно создан!');
                navigate('/posts');
            } catch (error) {
                toast.error('Произошла внутреняя ошибка. Попробуйте позже')
            }
        }
    };

    return (
        <CreatePostContainer>
            <CreatePostForm onSubmit={handleSubmit}>
                <FormTitle>Создание поста</FormTitle>
                <Input
                    type="text"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextArea
                    rows="5"
                    placeholder="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </Select>
                <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <Button type="submit">Создать пост</Button>
            </CreatePostForm>
        </CreatePostContainer>
    );
}

export default CreatePostPage;