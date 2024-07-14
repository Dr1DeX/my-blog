import React from "react";
import EditButtonStyled from "../../components/UserPostPage/EditButtonStyled";


const EditButton = ({ to, children }) => {
    return <EditButtonStyled to={to}>{children}</EditButtonStyled>;
}

export default EditButton;