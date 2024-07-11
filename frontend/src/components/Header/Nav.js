import styled from "styled-components";

const Nav = styled.nav`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        display: none;
    }

    a {
        color: white;
        margin: 0 10px;
        text-decoration: none;
    }
`;

export default Nav;