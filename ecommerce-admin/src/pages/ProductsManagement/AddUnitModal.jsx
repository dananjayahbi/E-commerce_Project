import React, { useState } from "react";
import { Modal, Form, Input, Button, InputNumber } from "antd";
import axios from "axios";

const AddUnitModal = ({ visible, onCancel, onAdd }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
  
    const onFinish = async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          console.error("Authentication token not found");
          return;
        }
  
        const response = await axios.post(
          "http://localhost:5000/units/addUnit",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log("Server response:", response.data);
  
        if (response.status === 200) {
          console.log("Unit added successfully");
          onAdd();
          // Reset the form fields after successful submission
          form.resetFields();
        } else {
          console.error("Unexpected server response:", response);
        }
      } catch (error) {
        console.error("Error adding unit:", error.response.data);
      } finally {
        setLoading(false);
      }
    };
  
    const handleCancel = () => {
      // Reset the form fields when the modal is canceled
      form.resetFields();
      onCancel();
    };
  
    return (
      <Modal
        title="Add New Unit"
        visible={visible}
        style={{ top: 20}}
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
            name="unitName"
            label="Unit Name"
            rules={[{ required: true, message: "Please enter the unit name" }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            name="shortName"
            label="Short Name"
            rules={[{ required: true, message: "Please enter the short name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="baseUnit"
            label="Base Unit"
            rules={[{ required: true, message: "Please enter the base unit" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="operator"
            label="Operator"
            rules={[{ required: true, message: "Please enter the operator" }]}
          >
            <Input />
          </Form.Item>
        <Form.Item
            name="operationValue"
            label="Operation Value"
            rules={[
                { required: true, message: "Please enter the operation value" },
            ]}
        >
            <InputNumber />
        </Form.Item>
        </Form>
      </Modal>
    );
}

export default AddUnitModal