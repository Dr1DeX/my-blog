import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PostContent from "../../components/PostPage/PostContent";
import PostsContainer from "../../components/PostPage/PostContainer";
import PostItem from "../../components/PostPage/PostItem";
import PostImage from "../../components/PostPage/PostImage";
import PostTitle from "../../components/PostPage/PostTitle";
import PostDescription from "../../components/PostPage/PostDescription";
import ReadMoreButton from "../../components/PostPage/ReadMoreButton";
import PostMeta from "../../components/PostPage/PostMeta";
import Paginator from "../../components/Paginator/Paginator";
import EditButton from "./EditButton";



const UserPostPage = ({ postUrl }) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const { token } = useAuth();



    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(postUrl, {
                    params: {
                        page,
                        page_size: pageSize
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setPosts(response.data[0]);
                setTotalPosts(response.data[1]);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [page, pageSize, token, postUrl]);

    const totalPages = Math.ceil(totalPosts / pageSize);
    
    const handlePageChange = (newPage) => {
        setPage(newPage);
    }
    
    return (
        <>
        <PostsContainer>
        {posts.map((post) => (
            <PostItem key={post.id}>
                <PostImage src={post.image_url} alt={post.title} />
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
                    <EditButton to={`/edit-post/${post.id}`}>Редактировать</EditButton>
                </PostContent>
            </PostItem>
        ))}
        </PostsContainer>
        <Paginator
            page={page}
            totalPage={totalPages}
            isLoading={isLoading}
            onPageChange={handlePageChange}
        />
        </>
    )
}

export default UserPostPage;