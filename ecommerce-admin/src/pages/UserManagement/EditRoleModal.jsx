import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Checkbox, Button, Row, Col } from "antd";
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
        products: values.permissions.includes("products") ? true : false,
        category: values.permissions.includes("category") ? true : false,
        units: values.permissions.includes("units") ? true : false,
        brands: values.permissions.includes("brands") ? true : false,
        orders: values.permissions.includes("orders") ? true : false,
        sales: values.permissions.includes("sales") ? true : false,
        newSale: values.permissions.includes("newSale") ? true : false,
        customers: values.permissions.includes("customers") ? true : false,
        users: values.permissions.includes("users") ? true : false,
        roles: values.permissions.includes("roles") ? true : false,
        salesReport: values.permissions.includes("salesReport") ? true : false,
        inventoryReport: values.permissions.includes("inventoryReport") ? true : false,
        productsReport: values.permissions.includes("productsReport") ? true : false,
        productQuantityAlerts: values.permissions.includes("productQuantityAlerts") ? true : false,
        systemSettings: values.permissions.includes("systemSettings") ? true : false,
        storeSettings: values.permissions.includes("storeSettings") ? true : false,
        emailTemplates: values.permissions.includes("emailTemplates") ? true : false,
        backup: values.permissions.includes("backup") ? true : false,
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
          <Checkbox.Group
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <Col span={24}>
              <Row>
                <span style={{ fontWeight: "600" }}>Products Management</span>
              </Row>
              <Row>
                <Checkbox value="products">Products</Checkbox>
              </Row>
              <Row>
                <Checkbox value="category">category</Checkbox>
              </Row>
              <Row>
                <Checkbox value="units">units</Checkbox>
              </Row>
              <Row>
                <Checkbox value="brands">brands</Checkbox>
              </Row>
              <br />

              <Row>
                <span style={{ fontWeight: "600" }}>Orders Management</span>
              </Row>
              <Row>
                <Checkbox value="orders">orders</Checkbox>
              </Row>
              <br />

              <Row>
                <span style={{ fontWeight: "600" }}>Sales Management</span>
              </Row>
              <Row>
                <Checkbox value="sales">sales</Checkbox>
              </Row>
              <Row>
                <Checkbox value="newSale">newSale</Checkbox>
              </Row>
              <br />

              <Row>
                <span style={{ fontWeight: "600" }}>People</span>
              </Row>
              <Row>
                <Checkbox value="customers">customers</Checkbox>
              </Row>
              <br />

              <Row>
                <span style={{ fontWeight: "600" }}>Users Management</span>
              </Row>
              <Row>
                <Checkbox value="users">users</Checkbox>
              </Row>
              <Row>
                <Checkbox value="roles">roles</Checkbox>
              </Row>
              <br />

              <Row>
                <span style={{ fontWeight: "600" }}>Reports</span>
              </Row>
              <Row>
                <Checkbox value="salesReport">salesReport</Checkbox>
              </Row>
              <Row>
                <Checkbox value="inventoryReport">inventoryReport</Checkbox>
              </Row>
              <Row>
                <Checkbox value="productsReport">productsReport</Checkbox>
              </Row>
              <Row>
                <Checkbox value="productQuantityAlerts">
                  productQuantityAlerts
                </Checkbox>
              </Row>
              <br />

              <Row>
                <span style={{ fontWeight: "600" }}>Settings</span>
              </Row>
              <Row>
                <Checkbox value="systemSettings">systemSettings</Checkbox>
              </Row>
              <Row>
                <Checkbox value="storeSettings">storeSettings</Checkbox>
              </Row>
              <Row>
                <Checkbox value="emailTemplates">emailTemplates</Checkbox>
              </Row>
              <Row>
                <Checkbox value="backup">backup</Checkbox>
              </Row>
            </Col>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRoleModal;
