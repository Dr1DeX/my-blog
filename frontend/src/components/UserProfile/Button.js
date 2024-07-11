import styled from "styled-components";

const Button = styled.button`
    padding: 10px;
    background: #333;
    color: #fff;
    border: none;
    cursor: pointer;

    &:hover {
        background: #555;
    }

    @media (max-width: 768px) {
        padding: 8px;
    }
`;

export default Button;