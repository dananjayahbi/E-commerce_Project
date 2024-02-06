import React from "react";
import { Input, Button, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = () => {
  const demoCategoryOptions = [
    {
      value: "zhejiang",
      label: "Zhejiang",
    },
    {
      value: "jiangsu",
      label: "Jiangsu",
    },
  ];

  return (
    <>
      <div>
        <Space.Compact style={{height: "40px"}}>
          <Select defaultValue="All Categories" placeholder="Category" options={demoCategoryOptions} style={{height:"40px", width: "300px"}} />
          <Input placeholder="Search Product ..." style={{width: "400px"}} />
          <Button icon={<SearchOutlined style={{color:"#fff"}} />} style={{backgroundColor: "#1677ff", border: "none", height: "40px", width: "40px"}}/>
        </Space.Compact>
      </div>
    </>
  );
};

export default SearchBar;
