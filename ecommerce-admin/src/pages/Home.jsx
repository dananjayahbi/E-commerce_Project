import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

const App = () => {
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);

  const handleUpload = () => {
    const formDataGI = new FormData();
    gallery.forEach((file) => {
      formDataGI.append("gallery", file);
    });

    setUploading(true);

    fetch("http://localhost:5000/products/uploadMultipleProductImages", {
      method: "POST",
      body: formDataGI,
    })
      .then((res) => res.json())
      .then(() => {
        setGallery([]);
        message.success("Upload successful.");
      })
      .catch(() => {
        message.error("Upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props = {
    onRemove: (file) => {
      const index = gallery.indexOf(file);
      const newGallery = gallery.slice();
      newGallery.splice(index, 1);
      setGallery(newGallery);
    },
    beforeUpload: (file) => {
      setGallery((prevGallery) => [...prevGallery, file]); // Append a single file at once
      return false;
    },
    gallery,
    multiple: true
  };
  
  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select Files</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </>
  );
};

export default App;
