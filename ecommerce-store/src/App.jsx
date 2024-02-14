import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Header from "./partials/Header";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);

  // Function to update search results
  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Header updateSearchResults={updateSearchResults} />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs />} />
        </Routes>
      </div>
      <div>{/* <h2>Footer</h2> */}</div>
    </div>
  );
};

export default App;
