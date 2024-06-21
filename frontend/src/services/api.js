import axios from 'axios';

const api = axios.create({
    baseUrl: 'http://localhost:8001/api',
});

export const fetchPosts = () => api.get('/post/all')