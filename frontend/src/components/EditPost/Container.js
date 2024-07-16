import styled from "styled-components";

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    @media (max-width: 768px) {
        padding: 10px;
    }
`;

export default Container;