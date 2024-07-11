import styled from "styled-components";

const ProfileImage = styled.img`
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        width: 80px;
        height: 80px;
    }
`;

export default ProfileImage