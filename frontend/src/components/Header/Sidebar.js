import { styled, css } from "styled-components";

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

export default Sidebar;