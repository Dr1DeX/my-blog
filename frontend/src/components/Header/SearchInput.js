import styled from "styled-components";

const SearchInput = styled.input`
    padding: 8px;
    border-radius: 4px;
    border: none;
    margin-right: 10px;
    outline: none;

    @media (max-width: 768px) {
        margin: 10px 0;
    }
`;

export default SearchInput;