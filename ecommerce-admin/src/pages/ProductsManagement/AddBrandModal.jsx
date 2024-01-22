import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const AddBrandModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

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
      }

      const response = await axios.post(
        "http://localhost:5000/brands/addBrand",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.status === 200) {
        console.log("Brand added successfully");
        onAdd();
        // Reset the form fields after successful submission
        form.resetFields();
      } else {
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error adding brand:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset the form fields when the modal is canceled
    form.resetFields();
    onCancel();
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
      title="Add New Brand"
      visible={visible}
      style={{ top: 20 }}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={form.submit}
        >
          Add
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
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="imageURL"
          label="Brand Logo"
          rules={[
            { required: true, message: "Please upload the brand logo!" },
          ]}
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBrandModal;
