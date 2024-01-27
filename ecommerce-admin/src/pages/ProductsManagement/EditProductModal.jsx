import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, InputNumber, Select } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const EditProductModal = ({ productId, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);

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

    // Fetch brands from the server
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/brands/getBrands"
        );
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    // Fetch units from the server
    const fetchUnits = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/units/getUnits"
        );
        setUnits(response.data);
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchUnits();
  }, []);

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
        setProductImagePreview(productData.featureImage);
        setGalleryPreview(productData.productGallery);

        // Set form values with the fetched product data
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

      const formDataFI = new FormData();
      fileList.forEach((file) => {
        formDataFI.append("productFimage", file);
      });

      const formDataGI = new FormData();
      gallery.forEach((file) => {
        formDataGI.append("gallery", file);
      });

      if (formDataFI) {
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
      }

      if (formDataGI) {
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
      }

      const response = await axios.put(
        `http://localhost:5000/products/updateProduct/${productId}`,
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
      console.error("Error updating product:", error.response.data);
    } finally {
      form.resetFields();
      setLoading(false);
    }
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
          rules={[{ required: true, message: "Please select the category" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Product Feature Image" name="imageURL">
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

            <Upload {...FIprops}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item name="productGallery" label="Product Gallery">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Display gallery images */}
            <div style={{ display: "flex" }}>
              {galleryPreview?.map((imageUrl, index) => (
                <div key={index} style={{ marginRight: "10px" }}>
                  <img
                    src={imageUrl}
                    alt={`Preview of gallery image ${index}`}
                    style={{ width: "50px", marginTop: "10px" }}
                  />
                </div>
              ))}
            </div>
            <Upload {...GIprops} multiple>
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          name="brand"
          label="Brand"
          rules={[{ required: true, message: "Please select the brand" }]}
        >
          <Select placeholder="Select a brand">
            {brands.map((brand) => (
              <Option key={brand._id} value={brand.brandName}>
                {brand.brandName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="unit"
          label="Unit"
          rules={[{ required: true, message: "Please select the unit" }]}
        >
          <Select placeholder="Select a unit">
            {units.map((unit) => (
              <Option key={unit._id} value={unit.unitName}>
                {unit.unitName}
              </Option>
            ))}
          </Select>
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
