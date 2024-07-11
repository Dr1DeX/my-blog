import styled from "styled-components";

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

export default PostsContainer;