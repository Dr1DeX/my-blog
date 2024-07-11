import styled from "styled-components";

const TextArea = styled.textarea`
    padding: 10px;
    font-size: 1rem;
    resize: none;
    width: 100%;

    @media (max-width: 768px) {
        padding: 8px;
        font-size: 0.9rem;
    }
`;

export default TextArea;