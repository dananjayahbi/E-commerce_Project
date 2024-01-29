import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Button, Row, Col } from "antd";
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
          products: values.permissions.includes("products"),
          category: values.permissions.includes("category"),
          units: values.permissions.includes("units"),
          brands: values.permissions.includes("brands"),
          orders: values.permissions.includes("orders"),
          sales: values.permissions.includes("sales"),
          newSale: values.permissions.includes("newSale"),
          customers: values.permissions.includes("customers"),
          users: values.permissions.includes("users"),
          roles: values.permissions.includes("roles"),
          salesReport: values.permissions.includes("salesReport"),
          inventoryReport: values.permissions.includes("inventoryReport"),
          productsReport: values.permissions.includes("productsReport"),
          productQuantityAlerts: values.permissions.includes(
            "productQuantityAlerts"
          ),
          systemSettings: values.permissions.includes("systemSettings"),
          storeSettings: values.permissions.includes("storeSettings"),
          emailTemplates: values.permissions.includes("emailTemplates"),
          backup: values.permissions.includes("backup"),
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
        // Reset the form fields after successful submission
        form.resetFields();
      } else {
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error adding role:", error.response.data);
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
      title="Add New Role"
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

export default AddRoleModal;
