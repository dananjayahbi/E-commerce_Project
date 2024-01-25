import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, InputNumber } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const EditProductModal = ({ productId, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [productImagePreview, setProductImagePreview] = useState(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token not found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/products/getProductById/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const productData = response.data;
        setProductImagePreview(productData.imageURL);

        // Set form values with the fetched unit data
        form.setFieldsValue({
          productName: productData.productName,
          category: productData.category,
          featureImage: productData.featureImage,
          brand: productData.brand,
          unit: productData.unit,
          sellingPrice: productData.sellingPrice,
          barcodeNumber: productData.barcodeNumber,
          stocks: productData.stocks,
          notes: productData.notes,
        });
      } catch (error) {
        console.error("Error fetching product by ID:", error);
      }
    };

    if (visible && productId) {
      fetchProductById();
    }
  }, [visible, productId, form]);

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
        `http://localhost:5000/brands/updateBrand/${productId}`,
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
      title="Edit Product"
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
          name="productName"
          label="Product Name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please enter the category" }]}
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
            {productImagePreview && (
              <div style={{ marginRight: "10px" }}>
                <img
                  src={productImagePreview}
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

export default EditProductModal;
