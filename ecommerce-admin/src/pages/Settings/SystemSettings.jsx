import React, { useState, useEffect } from "react";
import { PlusOutlined, LoadingOutlined, CopyOutlined } from "@ant-design/icons";
import {
  Modal,
  Upload,
  message,
  Spin,
  Collapse,
  Divider,
  Tooltip,
  Button,
} from "antd";
import errorImage from "../../images/error_img.png";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SystemSettings = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [minWidth, setMinWidth] = useState(1000); // Default minWidth

  useEffect(() => {
    // Fetch and display the existing 'dashboardLogo' image when component mounts
    fetchDashboardLogo().finally(() => setLoading(false));

    // Add event listener to update minWidth dynamically
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setMinWidth(400);
      } else if (width < 1200) {
        setMinWidth(600);
      } else if (width < 1440) {
        setMinWidth(800);
      } else {
        setMinWidth(1000);
      }
    };
    handleResize(); // Call once to set initial minWidth
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList: newFileList, file }) => {
    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
      // Update previewImage to show the newly uploaded image
      setPreviewImage(URL.createObjectURL(file.originFileObj));
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
    }
    setFileList(newFileList);
  };

  const fetchDashboardLogo = async () => {
    try {
      // Fetch the 'dashboardLogo' image from the backend
      const response = await fetch(
        "http://localhost:5000/systemSettings/getDashboardLogo"
      );
      if (response.ok) {
        setPreviewImage(URL.createObjectURL(await response.blob()));
      }
    } catch (error) {
      console.error("Error fetching dashboardLogo image", error);
    }
  };

  // CopyableText component
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

  // Collapse notes component
  const CollapseNotes = ({ isProtected, type, exampleBody }) => {
    const bodyLines = exampleBody.split("\n").map((line, index) => (
      <p key={index} style={{ paddingLeft: "20px", lineHeight: 0.5 }}>
        <b>{line}</b>
      </p>
    ));

    return (
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
            Protected? : <b>{isProtected}</b> <br /> Type : <b>{type}</b> <br />{" "}
            Example body (if any) : <br /> {bodyLines}
          </p>
        </div>
      </div>
    );
  };

  // Collapse items
  // productManagementItems
  const productManagementItems = [
    {
      key: "1",
      label: "Add Product",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/products/addProduct" />
          <CollapseNotes
            isProtected="true"
            type="POST"
            exampleBody={`{
                "productName" : "testProduct",
                "category" : "test",
                "featureImage" : "test",
                "productGallery" : ["test1", "test2" , "test3"],
                "productCode" : "test",
                "unit" : "test",
                "sellingPrice" : "1000",
                "barcodeNumber" : "123",
                "notes" : "test"
              }`}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Get all products",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/products/getProducts" />
          <CollapseNotes isProtected="false" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Get a product by Id",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/products/getProductById/{The Product Id}" />
          <CollapseNotes isProtected="true" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Update a Product",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/products/updateProduct/{The Product Id}" />
          <CollapseNotes
            isProtected="true"
            type="PUT"
            exampleBody={`{
                "productName" : "testProduct UPDATED"
              }`}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: "Delete a Product",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/products/deleteProduct/{The Product Id}" />
          <CollapseNotes
            isProtected="true"
            type="DELETE"
            exampleBody={`none`}
          />
        </div>
      ),
    },
  ];

  // categoryItems
  const categoryItems = [
    {
      key: "1",
      label: "Add Category",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/categories/addCategory" />
          <CollapseNotes
            isProtected="true"
            type="POST"
            exampleBody={`{
                "categoryName" : "testcateg2",
                "description" : "desc"
              }`}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Get all Categories",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/categories/getCategories" />
          <CollapseNotes isProtected="false" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Get a Category by Id",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/categories/getCategoryById/{The Category Id}" />
          <CollapseNotes isProtected="true" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Update a Category",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/categories/updateCategory/{The Category Id}" />
          <CollapseNotes
            isProtected="true"
            type="PUT"
            exampleBody={`{
              "categoryName" : "UPDATED"
              }`}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: "Delete a Category",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/categories/deleteCategory/{The Category Id}" />
          <CollapseNotes
            isProtected="true"
            type="DELETE"
            exampleBody={`none`}
          />
        </div>
      ),
    },
  ];

  // unitsItems
  const unitsItems = [
    {
      key: "1",
      label: "Add Unit",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/units/addUnit" />
          <CollapseNotes
            isProtected="true"
            type="POST"
            exampleBody={`{
                "unitName" : "testUnit3",
                "shortName" : "testshort",
                "baseUnit" : "testbase",
                "operator" : "j",
                "operationValue" : 1000
                }`}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Get all Units",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/units/getUnits" />
          <CollapseNotes isProtected="false" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Get an Unit by Id",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/units/getUnitById/{The Unit Id}" />
          <CollapseNotes isProtected="true" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Update an Unit",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/units/updateUnit/{The Unit Id}" />
          <CollapseNotes
            isProtected="true"
            type="PUT"
            exampleBody={`{
                "unitName" : "UPDATED"
                }`}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: "Delete an Unit",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/units/deleteUnit/{The Unit Id}" />
          <CollapseNotes
            isProtected="true"
            type="DELETE"
            exampleBody={`none`}
          />
        </div>
      ),
    },
  ];

  // brandsItems
  const brandsItems = [
    {
      key: "1",
      label: "Add Brand",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/brands/addBrand" />
          <CollapseNotes
            isProtected="true"
            type="POST"
            exampleBody={`{
              "brandName" : "testBrand2",
              "description" : "test",
              "imageURL" : "test URL"
            }`}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Get all Brands",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/brands/getBrands" />
          <CollapseNotes isProtected="false" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Get a Brand by Id",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/brands/getBrandById/{The Brand Id}" />
          <CollapseNotes isProtected="true" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Update a Brand",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/brands/updateBrand/{The Brand Id}" />
          <CollapseNotes
            isProtected="true"
            type="PUT"
            exampleBody={`{
                  "brandName" : "UPDATED"
                  }`}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: "Delete a Brand",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/brands/deleteBrand/{The Brand Id}" />
          <CollapseNotes
            isProtected="true"
            type="DELETE"
            exampleBody={`none`}
          />
        </div>
      ),
    },
  ];

  // userItems
  const userItems = [
    {
      key: "1",
      label: "Register User",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/register" />
          <CollapseNotes
            isProtected="true"
            type="POST"
            exampleBody={`{
                "firstName": "testFirst",
                "lastName": "testLast",
                "username": "testUser",
                "email": "test1@test.com",
                "password": "testPassword",
                "role": "user",
                "phoneNumber": "0712345678",
                "profileImage": "test URL",
                "NIC": "1234567890"
              }`}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Get all Users",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/getAllUsers" />
          <CollapseNotes isProtected="false" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Get an User by Id",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/getUserById/{The User Id}" />
          <CollapseNotes isProtected="true" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Update an User",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/updateUser/{The User Id}" />
          <CollapseNotes
            isProtected="true"
            type="PUT"
            exampleBody={`{
                    "username" : "UPDATED"
                    }`}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: "Delete an User",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/deleteUser/{The User Id}" />
          <CollapseNotes
            isProtected="true"
            type="DELETE"
            exampleBody={`none`}
          />
        </div>
      ),
    },
    {
      key: "6",
      label: "Login User",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/login" />
          <CollapseNotes
            isProtected="false"
            type="POST"
            exampleBody={`
              "emailOrUsername": "administrator",
              "password": "administrator"
            `}
          />
        </div>
      ),
    },
    {
      key: "7",
      label: "Get a new token for the User",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/token/{The User Id}" />
          <CollapseNotes isProtected="false" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "8",
      label: "Change Password",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/changePassword/{The User Id}" />
          <CollapseNotes
            isProtected="true"
            type="PUT"
            exampleBody={`
              "oldPassword": "testOldPassword",
              "newPassword": "testNewPassword"
            `}
          />
        </div>
      ),
    },
    {
      key: "9",
      label: "Send an OTP to the registered user (Reset Password Function)",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/handleOTP" />
          <CollapseNotes
            isProtected="false"
            type="POST"
            exampleBody={`
              "email": "isurudananjaya838@gmail.com"
            `}
          />
        </div>
      ),
    },
    {
      key: "10",
      label: "Veryfy the OTP (Reset Password Function)",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/verifyOTP" />
          <CollapseNotes
            isProtected="false"
            type="POST"
            exampleBody={`
              "otp": "534581"
            `}
          />
        </div>
      ),
    },
    {
      key: "11",
      label: "Reset Password (Reset Password Function)",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/users/resetPassword" />
          <CollapseNotes
            isProtected="false"
            type="POST"
            exampleBody={`
               "userId": "{The user Id}",
               "newPassword": "testNewPassword"
            `}
          />
        </div>
      ),
    },
  ];

  // rolesItems
  const rolesItems = [
    {
      key: "1",
      label: "Add Role",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/roles/addRole" />
          <CollapseNotes
            isProtected="true"
            type="POST"
            exampleBody={`{
                "roleName": "TestRole",
                "description": "This is a test role",
                "permissions": {
                    "dashboard": true,
                    "page1": true
                }
              }`}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Get all Roles",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/roles/getRoles" />
          <CollapseNotes isProtected="false" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Get a Role by Id",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/roles/getRoleById/{The Role Id}" />
          <CollapseNotes isProtected="true" type="GET" exampleBody={`none`} />
        </div>
      ),
    },
    {
      key: "4",
      label: "Update a Role",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/roles/updateRole/{The Role Id}" />
          <CollapseNotes
            isProtected="true"
            type="PUT"
            exampleBody={`{
                    "roleName" : "UPDATED"
              }`}
          />
        </div>
      ),
    },
    {
      key: "5",
      label: "Delete a Role",
      children: (
        <div>
          <CopyableText text="http://localhost:5000/roles/deleteRole/{The Role Id}" />
          <CollapseNotes
            isProtected="true"
            type="DELETE"
            exampleBody={`none`}
          />
        </div>
      ),
    },
  ];

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "400px",
              border: "1px solid #d9d9d9",
              borderRadius: "10px",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "400px",
                height: "200px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <img
                src={previewImage ? previewImage : errorImage}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Upload
                action="http://localhost:5000/systemSettings/uploadDashboardLogo"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length === 0 && uploadButton}
              </Upload>
            </div>
            <Modal
              visible={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
            <span style={{ fontSize: "12px" }}>
              Update the Admin Dashboard Logo here.
            </span>
          </div>
          {/* For Developers : Routes */}
          <Divider style={{ marginTop: "50px" }} />
          <div style={{ marginTop: "30px", minWidth: `${minWidth}px` }}>
            <span style={{ fontWeight: 500, fontSize: "30px", color: "red" }}>
              For Developers...
            </span>
            <div style={{ marginTop: "20px" }}>
              <span style={{ fontWeight: 700, fontSize: "24px" }}>
                Products Management
              </span>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: 500, fontSize: "16px" }}>
                  Products
                </span>
                <Collapse
                  style={{ marginTop: "10px" }}
                  items={productManagementItems}
                  accordion
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: 500, fontSize: "16px" }}>
                  Category
                </span>
                <Collapse
                  style={{ marginTop: "10px" }}
                  items={categoryItems}
                  accordion
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: 500, fontSize: "16px" }}>Units</span>
                <Collapse
                  style={{ marginTop: "10px" }}
                  items={unitsItems}
                  accordion
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: 500, fontSize: "16px" }}>
                  Brands
                </span>
                <Collapse
                  style={{ marginTop: "10px" }}
                  items={brandsItems}
                  accordion
                />
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <span style={{ fontWeight: 700, fontSize: "24px" }}>
                User Management
              </span>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: 500, fontSize: "16px" }}>Users</span>
                <Collapse
                  style={{ marginTop: "10px" }}
                  items={userItems}
                  accordion
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontWeight: 500, fontSize: "16px" }}>Roles</span>
                <Collapse
                  style={{ marginTop: "10px" }}
                  items={rolesItems}
                  accordion
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SystemSettings;
