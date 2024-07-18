import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from "axios";
import HeaderContainer from './HeaderContainer';
import Hamburger from './Hamburger';
import HamburgerBar from './HamburgerBar';
import Brand from './Brand';
import Nav from './Nav';
import SearchInput from './SearchInput';
import UserProfile from './UserProfile';
import SidebarContent from './SidebarContent';
import SidebarOverlay from './SidebarOverlay';
import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import Sidebar from './Sidebar';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [sidebarPosition, setSidebarPosition] = useState('left');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
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

    const handleSearchChange = async (e) => {
        setSearchTerm(e.target.value);

        if (e.target.value.length > 2) {
            try {
                const response = await axios.get(`http://localhost:8001/api/search?query=${e.target.value}`);
                const results = response.data;

                const highlightedResults = results.map(post => {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    const highlightedDescription = post.description.replace(regex, '<span class="highlight">$1</span>');

                    return { ...post, highlightedDescription };
                });

                setSearchResults(highlightedResults);
            } catch (error) {
                console.error('Ошибка при поиске:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        };
    }

    const handleResultClick = (id) => {
        navigate(`/post/${id}`);
        setSearchTerm('');
        setSearchResults([]);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebar') && !event.target.closest('.hamburger') && !event.target.closest('.user-profile') && !event.target.closest('.dropdown')) {
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
                <SearchInput
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
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
                            <Link to="/profile" onClick={closeSidebar}>Личный кабинет</Link>
                            <Link to="/my-posts" onClick={closeSidebar}>Мои посты</Link>
                            <Link to="/create-post" onClick={closeSidebar}>Создать пост</Link>
                            <Link to="/" onClick={() => { logout(); closeSidebar(); }}>Выйти</Link>
                        </>
                    )}
                </SidebarContent>
            </Sidebar>
            {searchResults.length > 0 && (
                <Dropdown className="dropdown">
                    {searchResults.map((post) => (
                        <DropdownItem key={post.id} onClick={() => handleResultClick(post.id)}>
                            <img src={post.image_url} alt={post.title} />
                            <div className="content">
                                <span className="author">{post.author_name}</span>
                                <div
                                    className="description"
                                    dangerouslySetInnerHTML={{ __html: post.highlightedDescription }}
                                />
                            </div>
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}
        </HeaderContainer>
    );
};

export default Header;