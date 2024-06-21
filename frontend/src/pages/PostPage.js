import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const PostsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: space-between

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const PostItem = styled.div`
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    width: calc(33.333% - 28px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s;
    max-width: calc(33.333% - 28px);

    &:hover {
        transform: translateY(-5px);
    }

    @media (max-width: 768px) {
        flex: 1 1 calc(100% - 40px);
        max-width: calc(100% - 40px);
    }
`;

const PostImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const PostContent = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const PostTitle = styled.h3`
    margin: 0 0 10px 0;
`;

const PostDescription = styled.p`
    flex: 1;
`;

const PostMeta = styled.div`
    font-size: 0.9em;
    color: #777;
    margin-top: 10px;
`;

const ReadMoreButton = styled(Link)`
    align-self: flex-start;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
    &:hover {
        background-color: #0056b3;
    }
`;

const PostPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8001/api/post/all')
        .then(responce => setPosts(responce.data))
        .catch(error => console.error(error));
    }, []);

    return (
        <PostsContainer>
        {posts.map((post) => (
            <PostItem key={post.id}>
                <PostImage src="https://via.placeholder.com/300" alt={post.title} />
                <PostContent>
                    <PostTitle>{post.title}</PostTitle>
                    <PostDescription>{post.description.slice(0,100)}...</PostDescription>
                    <PostMeta>
                    Автор поста: {post.author_name} | Последнее обновление {new Date(post.pub_updated).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                    })}
                    </PostMeta>
                    <ReadMoreButton to={`/post/${post.id}`}>Подробнее</ReadMoreButton>
                </PostContent>
            </PostItem>
        ))}
        </PostsContainer>
    )
}

export default PostPage;