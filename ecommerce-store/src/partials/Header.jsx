import React from "react";
import { Row, Col, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <div className="header" style={{width:"1600px"}}>
      <div className="first-part" style={{ height: "40px" }}>
        <Row justify="space-between" align="middle">
          <Col span={18}>
            <span>Store Address | Phone Number | Email</span>
          </Col>
          <Col span={6}>
            <Button type="text" style={{float:"right"}}>My Account</Button>
          </Col>
        </Row>
      </div>
      <div className="second-part">
        <Row justify="space-between" align="middle">
          <Col>LOGO</Col>
          <Col>
            <SearchBar />
          </Col>
          <Col>
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: "24px" }} />}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Header;
