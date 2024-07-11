import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CreatePostContainer from "../../components/CreatePost/CreatePostContainer";
import CreatePostForm from "../../components/CreatePost/CreatePostForm";
import Input from "../../components/CreatePost/Input";
import TextArea from "../../components/CreatePost/TextArea";
import Select from "../../components/CreatePost/Select";
import Button from "../../components/CreatePost/Button";
import FormTitle from "../../components/CreatePost/FormTitle";




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