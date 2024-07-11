import styled from "styled-components";

const Input = styled.input`
    margin-bottom: 15px;
    padding: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;

    @media (max-width: 768px) {
        padding: 14px;
        font-size: 14px;
    }
`;

export default Input;