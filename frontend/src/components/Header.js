import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #333;
    color: white;
`;

const Nav = styled.nav`
    a {
        color: white;
        margin: 0 10px;
        text-decoration: none;
    }
`;

const Header = () => {
    return(
    <HeaderContainer>
        <h1>Techno Dreamer</h1>
        <Nav>
            <Link to="/">Главная</Link>
            <Link to="/posts">Посты</Link>
        </Nav>
    </HeaderContainer>
    )
};

export default Header;