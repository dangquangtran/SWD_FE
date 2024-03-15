import React, { useState } from "react";

const FilterMember = ({ onFilter }) => {
  const [filters, setFilters] = useState({ buildingName: "", gender: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <div className="filter-bar">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="buildingName">Building Name:</label>
          <input
            type="text"
            id="buildingName"
            name="buildingName"
            value={filters.buildingName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={filters.gender}
            onChange={handleInputChange}
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button type="submit">Apply Filter</button>
      </form>
    </div>
  );
};

export default FilterMember;
