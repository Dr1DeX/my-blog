import styled from "styled-components";

const CreatePostForm = styled.form`
    display: flex;
    flex-direction: column;
    background: white;
    padding: 48px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;

    @media (max-width: 768px) {
        padding: 24px;
        box-shadow: none;
    }
`;

export default CreatePostForm;