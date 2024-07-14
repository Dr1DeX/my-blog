import React from "react";
import PaginatorButton from "./PaginatorButton";
import PaginatorContainer from "./PaginatorContainer";

const Paginator = ({ page, totalPage, isLoading, onPageChange }) => {
    const startPage = Math.max(1, page - 3);
    const endPage = Math.min(startPage + 6, totalPage);

    return (
        <PaginatorContainer>
            {[...Array(endPage - startPage + 1).keys()].map((num) => (
                <PaginatorButton
                    key={startPage + num}
                    active={page === startPage + num}
                    onClick={() => onPageChange(startPage + num)}
                    disabled={isLoading}
                >
                    {startPage + num}
                </PaginatorButton>
            ))}
        </PaginatorContainer>
    )
}

export default Paginator;