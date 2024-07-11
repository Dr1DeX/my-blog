import styled from "styled-components";

const TextArea = styled.textarea`
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    resize: none;

    @media (max-width) {
        padding: 14px;
        font-size: 14px;
    }
`;

export default TextArea;