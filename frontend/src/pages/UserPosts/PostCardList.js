import React from "react";
import PostCard from "./PostCard";
import CardListContainer from "../../components/UserPosts/PostCardList/CardListContainer";


const PostCardList = ({ posts }) => {
    return(
        <CardListContainer>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </CardListContainer>
    )
}

export default PostCardList;