import React from "react";
import styled from "styled-components";

const HomeContainer = styled.div`
    padding: 20px;
`;

const HomePage = () => {
    return (
        <HomeContainer>
            <h2>TechnoDreamer - блог о технологиях</h2>
            <p>This is homepage </p>
        </HomeContainer>
    )
}

export default HomePage;