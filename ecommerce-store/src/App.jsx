import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Header from "./partials/Header";

import SearchBar from "./partials/SearchBar";

const App = () => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Header />
      </div>
      <div
        style={{
          padding: "0 48px",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/searchBar" element={<SearchBar />} />
        </Routes>
      </div>
      <div>{/* <h2>Footer</h2> */}</div>
    </div>
  );
};

export default App;
