import React, { useEffect, useState } from "react";
import { Input, Button, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = () => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setInnerWidth(window.innerWidth);
  }, [innerWidth]);

  const demoCategoryOptions = [
    {
      value: "zhejiang",
      label: "Zhejiang",
    },
    {
      value: "testcateg1",
      label: "testcateg1",
    },
  ];

  const handleSearch = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/products/searchProducts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: selectedCategory,
            searchText: searchText,
          }),
        }
      );
      const data = await response.json();

      // Save searched data.products in localStorage
      localStorage.setItem("searchedProducts", JSON.stringify(data.products));

      // Retrieve and parse the data.products from localStorage
      const storedProducts = JSON.parse(localStorage.getItem("searchedProducts"));

      // Console log the storedProducts
      console.log(storedProducts);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <>
      {innerWidth < 1100 ? (
        <div>
          <Space.Compact style={{ height: "40px" }}>
            <Input
              placeholder="Search Product ..."
              style={{
                height: "40px",
                width: innerWidth < 380 ? "200px" : innerWidth < 780 ? "300px" : "400px",
                borderTopLeftRadius: "5px",
                borderBottomLeftRadius: "5px",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              icon={<SearchOutlined style={{ color: "#fff" }} />}
              style={{
                backgroundColor: "#1677ff",
                border: "none",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
                height: "40px",
                width: "40px",
              }}
              onClick={handleSearch}
            />
          </Space.Compact>
        </div>
      ) : (
        <div>
          <Space.Compact style={{ height: "40px" }}>
            <Select
              placeholder="All Categories"
              options={demoCategoryOptions}
              style={{ height: "40px", width: "300px" }}
              onChange={(value) => setSelectedCategory(value)}
            />
            <Input
              placeholder="Search Product ..."
              style={{ height: "40px", width: "400px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              icon={<SearchOutlined style={{ color: "#fff" }} />}
              style={{
                backgroundColor: "#1677ff",
                border: "none",
                height: "40px",
                width: "40px",
              }}
              onClick={handleSearch}
            />
          </Space.Compact>
        </div>
      )}
    </>
  );
};

export default SearchBar;
