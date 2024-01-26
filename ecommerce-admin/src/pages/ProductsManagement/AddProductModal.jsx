import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, InputNumber,Select } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const AddProductModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/categories/getCategories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching cartegories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      const formDataFI = new FormData();
      fileList.forEach((file) => {
        formDataFI.append("productFimage", file);
      });

      const formDataGI = new FormData();
      gallery.forEach((file) => {
        formDataGI.append("gallery", file);
      });

      try {
        await fetch(
          "http://localhost:5000/products/uploadFeaturedProductImage",
          {
            method: "POST",
            body: formDataFI,
          }
        )
          .then((res) => res.json())
          .then(() => {
            setFileList([]);
            console.log("Product Feature Image Upload successful.");
          });
      } catch (error) {
        message.error("Uploading Product Feature failed.");
        return;
      }

      try {
        await fetch(
          "http://localhost:5000/products/uploadMultipleProductImages",
          {
            method: "POST",
            body: formDataGI,
          }
        )
          .then((res) => res.json())
          .then(() => {
            setGallery([]);
            console.log("Product Gallery Upload successful.");
          });
      } catch (error) {
        message.error("Uploading Product Gallery failed.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/products/addProduct",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.status === 200) {
        console.log("Product added successfully");
        onAdd();
        // Reset the form fields after successful submission
        form.resetFields();
      } else {
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error adding product:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset the form fields when the modal is canceled
    form.resetFields();
    onCancel();
  };

  const FIprops = {
    //props for the feature image
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

  const GIprops = {
    //props for the gallery images
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
  };

  return (
    <Modal
      title="Add New Product"
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
          disabled={fileList.length === 0}
          loading={loading}
          onClick={form.submit}
        >
          {loading ? "Adding" : "Add"}
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please enter the category!" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category._id} value={category.categoryName}>
                {category.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="featureImage"
          label="Feature Product Image"
          rules={[
            {
              required: true,
              message: "Please upload the feature product image!",
            },
          ]}
        >
          <Upload {...FIprops}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="productGallery"
          label="Product Gallery"
          rules={[
            { required: true, message: "Please upload the product gallery!" },
          ]}
        >
          <Upload {...GIprops} multiple>
            <Button icon={<UploadOutlined />}>Select Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="brand"
          label="Brand"
          rules={[{ required: true, message: "Please enter the brand" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Unit"
          rules={[{ required: true, message: "Please enter the unit" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="sellingPrice"
          label="Selling Price"
          rules={[
            { required: true, message: "Please enter the selling price" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="barcodeNumber"
          label="Barcode Number"
          rules={[
            { required: true, message: "Please enter the barcode number" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="stocks"
          label="Stocks"
          rules={[
            { required: true, message: "Please enter the stocks" },
            { type: "integer", message: "Stocks must be an integer" },
          ]}
        >
          <InputNumber step={1} precision={0} />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
          rules={[{ required: true, message: "Please enter the notes" }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
