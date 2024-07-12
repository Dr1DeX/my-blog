import styled from "styled-components";

const CardListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
`;

export default CardListContainer;