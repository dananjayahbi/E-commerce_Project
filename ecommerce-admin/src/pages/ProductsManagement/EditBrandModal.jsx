import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button} from "antd";
import axios from "axios";

const EditBrandModal = ({ brandId, visible, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
  
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
        setLoading(false);
      };
    };  
  
    return (
      <Modal
        title="Edit Brand"
        visible={visible}
        onCancel={onCancel}
        style={{ top: 20}}
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
            name="imageURL"
            label="Brand Logo"
            rules={[{ required: true, message: "Please enter the brand logo" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
}

export default EditBrandModal