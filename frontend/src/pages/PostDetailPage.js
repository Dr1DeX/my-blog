import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const PostDetailContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`;

const PostImage = styled.img`
    width: 100%;
    height: auto;
    border-radius: 10px;
`;

const PostTitle = styled.h2`
    margin-top: 20px;
    font-size: 2em;
`;

const PostMeta = styled.div`
    font-size: 0.9rem;
    color: #777;
    margin: 10px 0;
`;

const PostDescription = styled.p`
    line-height: 1.6;
    margin-top: 20px;
`;

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