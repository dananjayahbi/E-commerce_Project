import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import axios from "axios";

const EditRoleModal = ({ roleId, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoleById = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token not found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/roles/getRoleById/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const roleData = response.data;

        // Set form values with the fetched role data
        form.setFieldsValue({
          roleName: roleData.roleName,
          description: roleData.description,
          permissions: roleData.permissions.reduce(
            (acc, permission) =>
              Object.entries(permission)
                .filter(([key, value]) => value)
                .map(([key]) => key),
            []
          ),
        });
      } catch (error) {
        console.error("Error fetching role by ID:", error);
      }
    };

    if (visible && roleId) {
      fetchRoleById();
    }
  }, [visible, roleId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("Authentication token not found");
        return;
      }
  
      // Create a single object with all pages and their permission states
      const permissionsObject = {
        dashboard: values.permissions.includes("dashboard") ? true : false,
        page1: values.permissions.includes("page1") ? true : false,
        page2: values.permissions.includes("page2") ? true : false,
        page3: values.permissions.includes("page3") ? true : false,
      };
  
      // Update values.permissions with the single object
      values.permissions = [permissionsObject];
  
      const response = await axios.put(
        `http://localhost:5000/roles/updateRole/${roleId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Server response:", response.data);
  
      if (response.status === 200) {
        console.log("Role updated successfully");
        onUpdate();
      } else {
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error updating role:", error.response.data);
    } finally {
      setLoading(false);
    };
  };  

  return (
    <Modal
      title="Edit Role"
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
          Update
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

export default EditRoleModal;
