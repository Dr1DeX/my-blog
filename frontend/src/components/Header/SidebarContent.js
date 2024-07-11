import styled from "styled-components";

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

export default SidebarContent;