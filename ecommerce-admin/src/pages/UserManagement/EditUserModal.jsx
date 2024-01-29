import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const EditUserModal = ({ visible, onCancel, userId, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch roles from the server
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/roles/getRoles"
        );
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token not found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/users/getUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;
        setProfileImagePreview(userData.profileImage);

        // Set form values with the fetched user data
        form.setFieldsValue({
          fullName: userData.fullName,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          phoneNumber: userData.phoneNumber,
          profileImage: userData.profileImage,
          NIC: userData.NIC,
          isActive: userData.isActive,
        });
      } catch (error) {
        console.error("Error fetching user by ID:", error);
      }
    };

    if (visible && userId) {
      fetchUserById();
    }
  }, [visible, userId, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("profileImage", file);
      });

      try {
        await fetch("http://localhost:5000/users/uploadImage", {
          method: "POST",
          body: formData,
        });

        setFileList([]);
      } catch (error) {
        message.error("Upload failed.");
        message.error("Failed to update profle image!");
      }

      const response = await axios.put(
        `http://localhost:5000/users/updateUser/${userId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.status === 200) {
        console.log("User updated successfully");
        message.success("User updated successfully!");
        onUpdate();
        onCancel();
      } else {
        console.error("Unexpected server response:", response);
        message.error("Failed to update user!");
      }
    } catch (error) {
      console.error("Error updating user:", error.response.data);
      message.error("Failed to update user!");
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
      title="Edit User"
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
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Please enter the full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter the username" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter the email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select the role" }]}
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
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Display the profile image */}
            {profileImagePreview && (
              <div style={{ marginRight: "10px" }}>
                <img
                  src={profileImagePreview}
                  alt="Preview of the image URL"
                  style={{ width: "50px", marginTop: "10px" }}
                />
              </div>
            )}

            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </div>
        </Form.Item>

        <Form.Item
          name="NIC"
          label="NIC"
          rules={[{ required: true, message: "Please enter the NIC" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="IsActive?"
          rules={[{ required: true, message: "Please select an option" }]}
        >
          <Select placeholder="Select an option">
            <Option value={true}>True</Option>
            <Option value={false}>False</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
