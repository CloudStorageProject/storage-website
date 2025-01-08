import React, { useState } from "react";
import { ReactComponent as SearchIcon } from "../../img/Search.svg";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleIconClick = () => {
    if (onSearch) {
      onSearch(query); 
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
      />
      <button
        onClick={handleIconClick}
        aria-label="Search"
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
