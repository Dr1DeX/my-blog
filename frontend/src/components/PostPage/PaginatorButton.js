import styled from "styled-components";

const PaginatorButton = styled.button`
    padding: 10px 20px;
    background-color: ${props => props.active ? "#007bff" : "white"};
    color: ${props => props.active ? "white" : "#007bff"};
    border: 1px solid #007bff;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

export default PaginatorButton;