import styled from "styled-components";

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

export default PostItem;