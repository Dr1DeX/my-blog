import styled from "styled-components";

const Container = styled.div`
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f4f4f4;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
        max-width: 90%;
        padding: 15px;
    }
`;

export default Container;