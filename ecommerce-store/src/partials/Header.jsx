import React, { useEffect, useState } from "react";
import { Row, Col, Button, Avatar, Badge, Tooltip } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import SearchBar from "./SearchBar";

const Header = ({ updateSearchResults }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
  }, [innerWidth]);

  return (
    <div
      className="header"
      style={{ width: "1600px", maxWidth: "1600px", padding: "0 20px" }}
    >
      <div className="first-part" style={{ height: "40px" }}>
        <Row justify="space-between" align="middle">
          <Col span={18}>
            <span>
              Store Address&nbsp;&nbsp;&nbsp;&nbsp; |
              &nbsp;&nbsp;&nbsp;&nbsp;Phone Number&nbsp;&nbsp;&nbsp;&nbsp; |
              &nbsp;&nbsp;&nbsp;&nbsp;Email
            </span>
          </Col>
          <Col span={6}>
            <Button type="text" style={{ float: "right" }}>
              <UserOutlined /> My Account
            </Button>
          </Col>
        </Row>
      </div>
      {innerWidth < 660 ? (
        <div
          className="second-part"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <img
                src="https://www.freeiconspng.com/thumbs/logo-design/3d-link-logo-brand-design-png-image-12.png"
                alt="LOGO"
                width={innerWidth < 560 ? "60px" : "80px"}
              />
            </Col>
            <Col>
              <a href="">
                <Tooltip title="Wishlist" placement="bottom">
                  <Avatar
                    size={innerWidth < 425 ? "medium" : "large"}
                    style={{
                      backgroundColor: "transparent",
                      color: "#111111",
                      marginRight: "20px",
                    }}
                    icon={<HeartOutlined />}
                  />
                </Tooltip>
              </a>
              <a href="">
                <Tooltip title="My Account" placement="bottom">
                  <Avatar
                    size={innerWidth < 425 ? "medium" : "large"}
                    style={{
                      backgroundColor: "transparent",
                      color: "#111111",
                      marginRight: "20px",
                    }}
                    icon={<UserOutlined />}
                  />
                </Tooltip>
              </a>
              <a href="">
                <Tooltip title="Cart" placement="bottom">
                  <Badge count={99} showZero size="small">
                    <Avatar
                      size={innerWidth < 425 ? "small" : "large"}
                      style={{ backgroundColor: "#1677ff" }}
                      icon={<ShoppingCartOutlined />}
                    />
                  </Badge>
                </Tooltip>
              </a>
            </Col>
          </Row>
          <Row style={{ justifyContent: "center" }}>
            <Col>
              <SearchBar />
            </Col>
          </Row>
        </div>
      ) : (
        <div className="second-part">
          <Row justify="space-between" align="middle">
            <Col>
              <img
                src="https://www.freeiconspng.com/thumbs/logo-design/3d-link-logo-brand-design-png-image-12.png"
                alt="LOGO"
                width="80px"
              />
            </Col>
            <Col>
              <SearchBar />
            </Col>
            <Col>
              <a href="">
                <Tooltip title="Wishlist" placement="bottom">
                  <Avatar
                    size="large"
                    style={{
                      backgroundColor: "transparent",
                      color: "#111111",
                      marginRight: "20px",
                    }}
                    icon={<HeartOutlined />}
                  />
                </Tooltip>
              </a>
              <a href="">
                <Tooltip title="My Account" placement="bottom">
                  <Avatar
                    size="large"
                    style={{
                      backgroundColor: "transparent",
                      color: "#111111",
                      marginRight: "20px",
                    }}
                    icon={<UserOutlined />}
                  />
                </Tooltip>
              </a>
              <a href="">
                <Tooltip title="Cart" placement="bottom">
                  <Badge count={99} showZero size="small">
                    <Avatar
                      size="medium"
                      style={{ backgroundColor: "#1677ff" }}
                      icon={<ShoppingCartOutlined />}
                    />
                  </Badge>
                </Tooltip>
              </a>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Header;
