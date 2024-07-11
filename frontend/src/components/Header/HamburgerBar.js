import { styled, css } from "styled-components";

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

export default HamburgerBar;