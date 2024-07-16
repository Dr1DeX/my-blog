import styled from "styled-components";


const EditPostContainer = styled.div`
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

export default EditPostContainer;