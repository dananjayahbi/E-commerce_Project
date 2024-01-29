import React, { useState, useEffect } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Modal, Upload, message, Spin } from "antd";
import errorImage from "../../images/error_img.png";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SingleImageUpload = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Fetch and display the existing 'dashboardLogo' image when component mounts
    fetchDashboardLogo().finally(() => setLoading(false));
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
        </div>
      )}
    </>
  );
};

export default SingleImageUpload;
