import styled from "styled-components";
import { Link } from "react-router-dom";

const ReadMoreButton = styled(Link)`
    align-self: flex-start;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
    &:hover {
        background-color: #0056b3;
    }
`;

export default ReadMoreButton;