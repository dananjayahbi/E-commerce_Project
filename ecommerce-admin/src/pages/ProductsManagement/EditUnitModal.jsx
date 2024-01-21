import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, InputNumber} from "antd";
import axios from "axios";

const EditUnitModal = ({ unitId, visible, onCancel, onUpdate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchUnitById = async () => {
        try {
          const token = localStorage.getItem("token");
  
          if (!token) {
            console.error("Authentication token not found");
            return;
          }
  
          const response = await axios.get(
            `http://localhost:5000/units/getUnitById/${unitId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          const unitData = response.data;
  
          // Set form values with the fetched unit data
          form.setFieldsValue({
            unitName: unitData.unitName,
            shortName: unitData.shortName,
            baseUnit: unitData.baseUnit,
            operator: unitData.operator,
            operationValue: unitData.operationValue,
          });
        } catch (error) {
          console.error("Error fetching unit by ID:", error);
        }
      };
  
      if (visible && unitId) {
        fetchUnitById();
      }
    }, [visible, unitId, form]);
  
    const onFinish = async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          console.error("Authentication token not found");
          return;
        }
    
        const response = await axios.put(
          `http://localhost:5000/units/updateUnit/${unitId}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log("Server response:", response.data);
    
        if (response.status === 200) {
          console.log("Unit updated successfully");
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
        title="Edit Unit"
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

export default EditUnitModal