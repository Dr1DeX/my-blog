import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';


const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #333;
    color: white;
    position: relative;
`;

const Brand = styled.h1`
    margin: 0;

    @media (max-width: 768px) {
        order: 2;
        margin-left: 10px;
    }
`;

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

const Hamburger = styled.div`
    display: none;
    flex-direction: column;
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex;
        order: 1;
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

const Sidebar = styled.div`
    position: fixed;
    top: 0;
    height: 100%;
    width: 250px;
    background-color: #333;
    overflow-x: hidden;
    transition: all 0.5s ease;
    z-index: 1000;
    padding-top: 20px;

    ${props => props.position === 'left' ? css`
        left: ${props.isOpen ? '0' : '-250px'};
    ` : css`
        right: ${props.isOpen ? '0' : '-250px'};
    `}
`;

const SidebarOverlay = styled.div`
    display: ${props => (props.isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 500;
`;

const SidebarContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;

    img {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
        cursor: pointer;
    }

    span {
        color: white;
        margin-bottom: 20px;
    }

    hr {
        width: 80%;
        border: 1px solid #444;
    }

    a {
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        width: 100%;
        text-align: center;

        &:hover {
            background-color: #444;
        }
    }
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-left: 10px;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [sidebarPosition, setSidebarPosition] = useState('left');
    const navigate = useNavigate();

    const toggleMenu = () => {
        setSidebarPosition('left');
        setIsOpen(!isOpen);
    };

    const openSidebar = () => {
        setSidebarPosition('right');
        setIsOpen(true);
    };

    const goToProfile = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebar') && !event.target.closest('.hamburger') && !event.target.closest('.user-profile')) {
                closeSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <HeaderContainer>
            <Hamburger onClick={toggleMenu} className="hamburger">
                <HamburgerBar isOpen={isOpen} />
                <HamburgerBar isOpen={isOpen} />
                <HamburgerBar isOpen={isOpen} />
            </Hamburger>
            <Brand>TechnoDreamer</Brand>
            <Nav>
                <Link to="/">Главная</Link>
                <Link to="/posts">Посты</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/create-post">Создать пост</Link>
                        <Link to="/" onClick={logout}>Выйти</Link>
                        <UserProfile onClick={openSidebar} className="user-profile">
                            <img src={user?.image} alt="user" />
                        </UserProfile>
                    </>
                ) : (
                    <>
                        <Link to="/login">Войти</Link>
                        <Link to="/register">Регистрация</Link>
                    </>
                )}
            </Nav>
            <SidebarOverlay isOpen={isOpen} onClick={closeSidebar} />
            <Sidebar isOpen={isOpen} className="sidebar" position={sidebarPosition}>
                <SidebarContent>
                {isAuthenticated && user?.image && (
                        <img src={user.image} alt="user" onClick={goToProfile} />
                    )}
                    {isAuthenticated && <span>{user?.username}</span>}
                    <hr />
                    <Link to="/" onClick={closeSidebar}>Главная</Link>
                    <Link to="/posts" onClick={closeSidebar}>Посты</Link>
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" onClick={closeSidebar}>Войти</Link>
                            <Link to="/register" onClick={closeSidebar}>Регистрация</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/create-post" onClick={closeSidebar}>Создать пост</Link>
                            <Link to="/" onClick={() => { logout(); closeSidebar(); }}>Выйти</Link>
                        </>
                    )}
                </SidebarContent>
            </Sidebar>
        </HeaderContainer>
    );
};

export default Header;