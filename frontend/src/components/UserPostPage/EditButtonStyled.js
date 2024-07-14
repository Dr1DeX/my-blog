import { Link } from "react-router-dom";
import styled from "styled-components";

const EditButtonStyled = styled(Link)`
    display: inline-block;
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;
    &:hover {
        background-color: #0056b3;
    }
`;

export default EditButtonStyled;