import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EditPostContainer from "../../components/EditPost/EditPostContainer";
import EditPostForm from "../../components/EditPost/EditPostForm";
import EditPostInput from "../../components/EditPost/EditPostInput";
import EditPostTextarea from "../../components/EditPost/EditPostTextarea";
import EditPostButton from "../../components/EditPost/EditPostButton";
import EditPostSelect from "../../components/EditPost/EditPostSelect";
import { toast } from "react-toastify";
import EditPostImageUpload from "../../components/EditPost/EditPostImageUpload";

const EditPostPage = ({ postUrl, updatePostUrl, categoriesUrl }) => {
    const { id } = useParams();
    const { token } = useAuth();
    const [post, setPost] = useState(null);
    const [formData, setFormData] = useState({
        title: null,
        description: null,
        category_id: null,
        image_url: null,
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${postUrl}/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setPost(response.data);
                setFormData({
                    title: response.data.title || null,
                    description: response.data.description || null,
                    category_id: response.data.category_id || null,
                    image_url: response.data.image_url || null,
                });
            } catch (error) {
                if (error.response && error.response.status === 404 || error.response.status === 401){
                    navigate('/my-posts')
                }
                console.error('Error fetching post:', error)
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${categoriesUrl}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setCategories(response.data)
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchPost();
        fetchCategories();
    }, [id, postUrl, categoriesUrl, token]);

    const handleChange = (e) => {
       const { name, value } = e.target;
       setFormData({
        ...formData,
        [name]: name === 'category_id' ? parseInt(value) : value,
       })
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                image_url: reader.result,
            })
        };
        if (file) {
            reader.readAsDataURL(file)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.patch(updatePostUrl, formData, {
                params: {id: id},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Пост успешно обновлен!')
        } catch (error) {
            console.error('Error updating post:', error)
        }
    };

    if (!post) {
        return <>Loading....</>
    }

    return (
        <EditPostContainer>
            <h1>Редактирование поста</h1>
            <EditPostForm onSubmit={handleSubmit}>
                <EditPostInput
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Заголовок"
                />
                <EditPostTextarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Описание"
                />
                <EditPostSelect
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                >
                    <option value="">Выбрать категорию</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </EditPostSelect>
                <EditPostImageUpload
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <EditPostButton type="submit">Обновить пост</EditPostButton>
            </EditPostForm>
        </EditPostContainer>
    )
}

export default EditPostPage;