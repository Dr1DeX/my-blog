import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const PostsContainer = styled.div`
    padding: 20px
`;

const PostItem = styled.div`
    margin-bottom: 20px
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
        <h2>Posts</h2>
        {posts.map(post => (
            <PostItem key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
            </PostItem>
        ))}
        </PostsContainer>
    )
}

export default PostPage;