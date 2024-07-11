import styled from "styled-components";

const Dropdown = styled.div`
    position: absolute;
    top: 60px; /* Это значение нужно отрегулировать в зависимости от высоты вашего SearchInput */
    left: 0;
    width: 100%;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 2000;
    max-height: 300px;
    overflow-y: auto;

    @media (max-width: 768px) {
        width: 90%;
        left: 5%;
    }
`;

export default Dropdown;