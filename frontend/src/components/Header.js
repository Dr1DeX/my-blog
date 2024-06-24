import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #333;
    color: white;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const Brand = styled.h1`
    margin: 0;
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        max-height: ${props => (props.isOpen ? '300px' : '0')};
        opacity: ${props => (props.isOpen ? '1' : '0')};
        visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
        transform: ${props => (props.isOpen ? 'translateY(0)' : 'translateY(-20px)')};
        overflow: hidden;
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;

        a {
            margin: 10px 0;
            width: 100%;
            text-align: center;
        }
    }

    a {
        color: white;
        margin: 0 10px;
        text-decoration: none;
    }

    
`;

const Hamburger = styled.div`
    display: none;
    flex-direction: column;
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex;
        position: absolute;
        top: 20px;
        right: 20px;
    }

`;

const HamburgerBar = styled.div`
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 4px 0;
    transition: all 0.3s ease;

    ${({ isOpen }) => isOpen && css`
        &:nth-child(1) {
            transform: rotate(45deg) translate(10px, 5px);
        }
        &:nth-child(2) {
            opacity: 0;
        }
        &:nth-child(3) {
            transform: rotate(-45deg) translate(10px, -5px);
        }
    `}
`;

const Username = styled.span`
    margin-right: 10px;
`;

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    
    return(
    <HeaderContainer>
        <Brand>Techno Dreamer</Brand>
        <Hamburger onClick={toggleMenu}>
            <HamburgerBar isOpen={isOpen} />
            <HamburgerBar isOpen={isOpen} />
            <HamburgerBar isOpen={isOpen} />
        </Hamburger>
        <Nav isOpen={isOpen}>
            <Link to="/">Главная</Link>
            <Link to="/posts">Посты</Link>
            {isAuthenticated ? (
                <>
                    <Username>{user?.username}</Username>
                    <Link to="/create-post">Создать пост</Link>
                    <Link to="/" onClick={logout}>Выйти</Link>
                </>
            ) : (
                <>
                    <Link to="/login">Войти</Link>
                    <Link to="/register">Регистрация</Link>
                </>
            )}
        </Nav>
    </HeaderContainer>
    )
};

export default Header;