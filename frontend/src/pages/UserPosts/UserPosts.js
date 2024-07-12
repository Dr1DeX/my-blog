import React, { useState, useEffect } from "react";
import axios from "axios";
import PageContainer from "../../components/UserPosts/PageContainer";
import { useAuth } from "../../context/AuthContext";
import Filters from "./Filters";
import PostCardList from "./PostCardList";


const UserPost = () => {
    const [filters, setFilters] = useState({ pub_updated: '', title: ''});
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8001/api/post/my_posts', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setPosts(data);  
            } catch (error) {
                console.error('Error fetching posts:', error)
            }
        };
        if (token){
            fetchPosts();
        }
    }, [token]);

    useEffect(() => {
        let filtered = posts;

        if (filtered.pub_updated) {
            filtered = filtered.filter((post) => 
            post.pub_updated.startsWith(filters.pub_updated)
        );
        }
        if (filtered.title) {
            filtered = filtered.filter((post) =>
            post.title.toLowerCase().includes(filters.title.toLowerCase())
        );
        }
        setFilteredPosts(filtered);
    }, [filters, posts]);

    return (
        <PageContainer>
            <Filters filters={filters} setFilters={setFilters} />
            <PostCardList posts={filteredPosts} />
        </PageContainer>
    )
}

export default UserPost;