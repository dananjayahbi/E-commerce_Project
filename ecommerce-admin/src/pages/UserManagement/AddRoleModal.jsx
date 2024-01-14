import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import axios from "axios";

const AddRoleModal = ({ visible, onCancel, onAdd }) => {
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
  
      // Map the checkbox values to the corresponding permissions
      const formattedValues = {
        ...values,
        permissions: {
          dashboard: values.permissions.includes("dashboard"),
          page1: values.permissions.includes("page1"),
          page2: values.permissions.includes("page2"),
          page3: values.permissions.includes("page3"),
        },
      };
  
      console.log("Sending data:", formattedValues);
  
      const response = await axios.post(
        "http://localhost:5000/roles/addRole",
        formattedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Server response:", response.data);
  
      if (response.status === 200) {
        console.log("Role added successfully");
        onAdd();
      } else {
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error adding role:", error.response.data);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal
      title="Add New Role"
      visible={visible}
      onCancel={onCancel}
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
          Add
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="roleName"
          label="Role Name"
          rules={[{ required: true, message: "Please enter the role name" }]}
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

        <Form.Item name="permissions" label="Permissions">
          <Checkbox.Group style={{ width: "100%" }}>
            <Checkbox value="dashboard">Dashboard</Checkbox>
            <Checkbox value="page1">Page 1</Checkbox>
            <Checkbox value="page2">Page 2</Checkbox>
            <Checkbox value="page3">Page 3</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoleModal;
