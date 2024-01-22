import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const EditBrandModal = ({ brandId, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [brandImagePreview, setBrandImagePreview] = useState(null);

  useEffect(() => {
    const fetchBrandById = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token not found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/brands/getBrandById/${brandId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const brandData = response.data;
        setBrandImagePreview(brandData.imageURL);

        // Set form values with the fetched unit data
        form.setFieldsValue({
          brandName: brandData.brandName,
          description: brandData.description,
          imageURL: brandData.imageURL,
        });
      } catch (error) {
        console.error("Error fetching beand by ID:", error);
      }
    };

    if (visible && brandId) {
      fetchBrandById();
    }
  }, [visible, brandId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("brandLogo", file);
      });

      try {
        await fetch("http://localhost:5000/brands/uploadImage", {
          method: "POST",
          body: formData,
        });

        setFileList([]);
      } catch (error) {
        message.error("Upload failed.");
        message.error("Failed to update Brand image!");
      }

      const response = await axios.put(
        `http://localhost:5000/brands/updateBrand/${brandId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.status === 200) {
        console.log("Brand updated successfully");
        onUpdate();
      } else {
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error updating unit:", error.response.data);
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title="Edit Brand"
      visible={visible}
      onCancel={onCancel}
      style={{ top: 20 }}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={form.submit}
        >
          Update
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="brandName"
          label="Brand Name"
          rules={[{ required: true, message: "Please enter the brand name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Brand Logo"
          name="imageURL"
          rules={[{ required: true, message: "Please upload the brand logo!" }]}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Display the brand logo */}
            {brandImagePreview && (
              <div style={{ marginRight: "10px" }}>
                <img
                  src={brandImagePreview}
                  alt="Preview of the image URL"
                  style={{ width: "50px", marginTop: "10px" }}
                />
              </div>
            )}

            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBrandModal;
