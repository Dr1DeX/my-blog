import styled from "styled-components";

const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f0f0f0;
    }

    img {
        border-radius: 5px;
        width: 60px;
        height: 60px;
        margin-right: 10px;
    }

    .content {
        display: flex;
        flex-direction: column;

        .author {
            font-weight: bold;
        }

        .description {
            display: flex;
            flex-direction: column;
            margin-top: 5px;

            .highlight {
                background-color: yellow;
                padding: 0 2px;
            }
        }
    }
`;

export default DropdownItem;