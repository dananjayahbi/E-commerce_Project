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
      const response = await fetch("http://localhost:5000/products/searchProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          searchText: searchText,
        }),
      });
      const data = await response.json();
      console.log(data.products); //Prints the products object array
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <>
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
    </>
  );
};

export default SearchBar;
