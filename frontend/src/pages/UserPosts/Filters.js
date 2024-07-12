import React from "react";
import FiltersContainer from "../../components/UserPosts/Filters/FiltersContainer";

const Filters = ({ filters, setFilters }) => {
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    return (
        <FiltersContainer>
            <label>
                Дата:
                <input
                    type="date"
                    name="pub_updated"
                    value={filters.pub_updated}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Названание:
                <input
                    type="text"
                    name="text"
                    value={filters.title}
                    onChange={handleInputChange}
                />
            </label>
        </FiltersContainer>
    )
}

export default Filters;