import styled from "styled-components";

const Hamburger = styled.div`
    display: none;
    flex-direction: column;
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex;
        order: 1;
    }
`;

export default Hamburger;