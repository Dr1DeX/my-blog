import styled from "styled-components";

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-left: 10px;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

export default UserProfile;