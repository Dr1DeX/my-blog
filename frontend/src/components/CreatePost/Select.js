import styled from "styled-components";

const Select = styled.select`
    margin-bottom: 15px;
    padding: 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;

    @media (max-width: 768px) {
        padding: 14px;
        font-size: 14px;
    }
`;

export default Select;