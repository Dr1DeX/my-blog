import { Link } from "react-router-dom";
import styled from "styled-components";

const PostLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

export default PostLink;