import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const CopyableText = ({ text }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyToClipboard = () => {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1500);
  };

  return (
    <div
      style={{
        backgroundColor: "#E6F4FF",
        height: "55px",
        borderRadius: "12px",
        border: "1px solid #9BCFFF",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        color: "#5B92E7",
        position: "relative",
      }}
    >
      <span>{text}</span>
      <Tooltip title={copySuccess ? "Copied!" : "Copy"}>
        <Button
          type="text"
          icon={<CopyOutlined style={{ color: "#000000" }} />}
          style={{ position: "absolute", right: "10px", color: "#ffffff" }}
          onClick={handleCopyToClipboard}
        />
      </Tooltip>
    </div>
  );
};

const Home = () => {
  const exampleBody = `{
    "firstName": "testFirst2",
    "lastName": "testLast2",
    "username": "testUser2",
    "email": "test1@test.com",
    "password": "Indusara2",
    "role": "user",
    "phoneNumber": "0713451678",
    "profileImage": "test URL",
    "NIC": "1234567890"
  }`;

  const bodyLines = exampleBody.split("\n").map((line, index) => (
    <p key={index} style={{ paddingLeft: "20px", lineHeight: 0.5 }}>
      <b>{line}</b>
    </p>
  ));

  return (
    <>
      <div>
        <CopyableText text="http://localhost:5000/systemSettings/getDashboardLogo" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            backgroundColor: "#F0F5FF",
            height: "auto",
            borderRadius: "12px",
            border: "1px dashed #9BCFFF",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            color: "#5B92E7",
            position: "relative",
          }}
        >
          <p>
            Protected? : <b>true</b> <br /> Example body (if any) : <br />{" "}
            {bodyLines}
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
