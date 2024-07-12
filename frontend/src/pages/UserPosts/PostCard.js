import React from "react";
import Card from "../../components/UserPosts/PostCard/Card";
import CardContent from "../../components/UserPosts/PostCard/CardContent";
import CardDate from "../../components/UserPosts/PostCard/CardDate";
import CardLink from "../../components/UserPosts/PostCard/CardLink";
import CardTitle from "../../components/UserPosts/PostCard/CardTitle";

const PostCard = ({ post }) => {
    return (
        <Card>
            <CardTitle>{post.title}</CardTitle>
            <CardContent>{post.description.slice(0, 100)}...</CardContent>
            <CardDate>Последнее обновление {new Date(post.pub_updated).toLocaleDateString()}</CardDate>
            <CardLink to={`/post/${post.id}`}>Подробнее</CardLink>
        </Card>
    )
};

export default PostCard;