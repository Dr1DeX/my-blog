import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
    text-align: center;
    padding: 20px;
    background-color: #333;
    color: white;
    position: fixed;
    bottom: 0;
    width: 100%;
`;

const Footer = () => {
    return(
    <FooterContainer>
        <p>&copy; TechnoDreamer. All rights reserved</p>
    </FooterContainer>
)
}

export default Footer;