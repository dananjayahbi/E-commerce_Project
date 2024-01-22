import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, InputNumber} from "antd";
import axios from "axios";

const EditCategoryModal = ({ categoryId, visible, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchCategoryById = async () => {
        try {
          const token = localStorage.getItem("token");
  
          if (!token) {
            console.error("Authentication token not found");
            return;
          }
  
          const response = await axios.get(
            `http://localhost:5000/categories/getCategoryById/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          const categoryData = response.data;
  
          // Set form values with the fetched unit data
          form.setFieldsValue({
            categoryName: categoryData.categoryName,
            description: categoryData.description,
          });
        } catch (error) {
          console.error("Error fetching category by ID:", error);
        }
      };
  
      if (visible && categoryId) {
        fetchCategoryById();
      }
    }, [visible, categoryId, form]);
  
    const onFinish = async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          console.error("Authentication token not found");
          return;
        }
    
        const response = await axios.put(
          `http://localhost:5000/categories/updateCategory/${categoryId}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log("Server response:", response.data);
    
        if (response.status === 200) {
          console.log("Category updated successfully");
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
        title="Edit Category"
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
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: "Please enter the category name" }]}
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
        </Form>
      </Modal>
    );
}

export default EditCategoryModal