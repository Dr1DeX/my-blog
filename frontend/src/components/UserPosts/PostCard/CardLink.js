import styled from "styled-components";
import { Link } from "react-router-dom";

const CardLink = styled(Link)`
    margin-top: 16px;
    padding: 8px 16px;
    background: #007bff;
    color: #fff;
    text-align: center;
    text-decoration: none;
    border-radius: 4px;

    &:hover {
        background: #0056b3;
    }
`;

export default CardLink;