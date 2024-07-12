import styled from "styled-components";

const FiltersContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    label {
        margin-bottom: 10px;

        input {
            margin-left: 10px;
            padding: 5px;
        }
    }

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;

        label {
            margin-bottom: 0;

            input {
                margin-left: 10px;
                padding: 5px;
            }
        }
    }
`;

export default FiltersContainer;