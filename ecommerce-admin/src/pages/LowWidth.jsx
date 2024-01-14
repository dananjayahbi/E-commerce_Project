import React from "react";
import { Result } from "antd";

const LowWidth = () => {

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Result
        status="403"
        title="Oops! Access Denied"
        subTitle={
          <>
            Sorry, the device width is too low to access this software.
            <br />
            Please use a device with a higher width. (More than 768px)
          </>
        }
      />
    </div>
  );
};

export default LowWidth;
