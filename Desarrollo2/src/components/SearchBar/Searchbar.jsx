import React, { useState } from "react";

const Searchbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", margin: "20px" }}>
      <input
        type="text"
        placeholder="Buscar películas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px",
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "4px 0 0 4px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "0 4px 4px 0",
        }}
      >
        Buscar
      </button>
    </form>
  );
};

export default Searchbar;