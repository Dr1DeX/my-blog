import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostImage from '../../components/PostDetailPage/PostImage';
import PostDetailContainer from '../../components/PostDetailPage/PostDetailContainer';
import PostTitle from '../../components/PostDetailPage/PostTitle';
import PostDescription from '../../components/PostDetailPage/PostDescription';
import PostMeta from '../../components/PostDetailPage/PostMeta';

const PostDetailPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8001/api/post/${id}`)
        .then(responce => setPost(responce.data))
        .catch(error => console.error(error));
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <PostDetailContainer>
            <PostImage src={post.image_url || "https://via.placeholder.com/800"} alt={post.title} />
            <PostTitle>{post.title}</PostTitle>
            <PostDescription>{post.description}</PostDescription>
            <PostMeta>
                Автор поста: {post.author_name} | Последнее обновление {post.pub_updated}
            </PostMeta>
        </PostDetailContainer>
    )
}

export default PostDetailPage