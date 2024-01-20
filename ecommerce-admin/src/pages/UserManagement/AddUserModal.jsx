import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Select } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const AddUserModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch roles from the server
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles/getRoles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleAddUser = async (values) => {
    setLoading(true);

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("profileImage", file);
    });

    try {
      console.log(formData)
      await fetch("http://localhost:5000/users/uploadImage", {
        method: "POST",
        body: formData,
      });

      setFileList([]);
    } catch (error) {
      message.error("Upload failed.");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        values
      );
      console.log(response);
      // Assuming the addUser API returns the newly added user data
      onAdd();
      onCancel(); // Close the modal after successful addition
      form.resetFields(); // Reset form fields
      message.success("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      message.error("Failed to add user (check fields!)!");
    } finally {
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
      title="Add New User"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Add User
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleAddUser}>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please enter the first name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please enter the last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter the username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter the email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter the password!",
            },
            {
              min: 8,
              message: "Password must be at least 8 characters long!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please enter the role!" }]}
        >
          <Select placeholder="Select a role">
            {roles.map((role) => (
              <Option key={role._id} value={role.roleName}>
                {role.roleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Phone"
          name="phoneNumber"
          rules={[
            {
              required: true,
              message: "Please enter the phone number!",
            },
            {
              pattern: new RegExp("^[0-9]{10}$"),
              message: "Please enter a valid phone number!",
            },
            {
              max: 10,
              message: "Phone number must be 10 digits long!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Profile Image"
          name="profileImage"
          rules={[
            { required: true, message: "Please upload the profile image!" },
          ]}
        >
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="NIC"
          name="NIC"
          rules={[{ required: true, message: "Please enter the NIC!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
