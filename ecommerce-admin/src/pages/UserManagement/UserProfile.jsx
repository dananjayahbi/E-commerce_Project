import React, { useEffect, useState } from 'react';
import { Card, Spin, Avatar, Button, Input, Form, message } from 'antd';
import axios from 'axios';
import EditUserModalnonAdmin from './EditUserModalnonAdmin';

const { Meta } = Card;

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [form] = Form.useForm();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            console.error('Authentication token not found');
            return;
        }

        const fetchUserById = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/getUserById/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user by ID:', error);
                message.error('Error fetching user');
                setLoading(false);
            }
        };
        fetchUserById();
    }, [userId, token]);

    const handlePasswordChange = async () => {
        try {
            await axios.put(`http://localhost:5000/users/changePassword/${userId}`, {
                oldPassword,
                newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Password changed successfully:');
            message.success('Password changed successfully');
            // Reset the form
            form.resetFields();
        } catch (error) {
            console.error('Error changing password:', error);
            message.error(error.response.data.message);
            // Optionally, you can handle error scenario here
        }
    };

    const handleEditUserModalOpen = () => {
        setEditModalVisible(true);
    };

    const handleEditUserModalCancel = () => {
        setEditModalVisible(false);
    };

    const handleEditUserModalUpdate = async (updatedUserData) => {
        try {
            // Send updatedUserData to server to update user
            console.log('Updated user data:', updatedUserData);
            // Optionally, you can handle success scenario here
        } catch (error) {
            console.error('Error updating user:', error);
            // Optionally, you can handle error scenario here
        }
    };

    return (
        <div>
          {loading ? (
            <Spin size="large" />
          ) : user ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Avatar size={100} src={user.profileImage} />
              </div>
              <Card style={{ width: 600, margin: '0 auto 20px auto' }} loading={loading}>
                <Meta
                  title="User Information"
                  description={
                    <>
                      <Form form={form} layout="vertical">
                      <Form.Item label="Full Name">
                          <Input value={user.fullName} readOnly />
                        </Form.Item>
                        <Form.Item label="Username">
                          <Input value={user.username} readOnly />
                        </Form.Item>
                        <Form.Item label="Email">
                          <Input value={user.email} readOnly />
                        </Form.Item>
                        <Form.Item label="Role">
                          <Input value={user.role} readOnly />
                        </Form.Item>
                        <Form.Item label="Phone">
                          <Input value={user.phoneNumber} readOnly />
                        </Form.Item>
                        <Form.Item label="NIC">
                          <Input value={user.NIC} readOnly />
                        </Form.Item>
                        {/* Add more fields here */}
                      </Form>
                      <Button onClick={handleEditUserModalOpen}>Edit</Button>
                    </>
                  }
                />
              </Card>
              {showPasswordChange && (
                <Card style={{ width: 300, margin: '0 auto 20px auto' }}>
                  <Form form={form} onFinish={handlePasswordChange}>
                    <Form.Item
                      label="Old Password"
                      name="oldPassword"
                      rules={[{ required: true, message: 'Please input your old password!' }]}
                    >
                      <Input.Password onChange={e => setOldPassword(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                      label="New Password"
                      name="newPassword"
                      rules={[{ required: true, message: 'Please input your new password!' }]}
                    >
                      <Input.Password onChange={e => setNewPassword(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                      label="Confirm Password"
                      name="confirmPassword"
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password onChange={e => setConfirmPassword(e.target.value)} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Change Password</Button>
                  </Form>
                </Card>
              )}
              <div style={{ textAlign: 'center' }}>
                <Button onClick={() => setShowPasswordChange(!showPasswordChange)}>
                  {showPasswordChange ? 'Hide Password Change' : 'Change Password'}
                </Button>
              </div>
            </div>
          ) : (
            <div>No user found</div>
          )}
          {/* Edit User Modal */}
          <EditUserModalnonAdmin
            userId={userId}
            visible={editModalVisible}
            onCancel={handleEditUserModalCancel}
            onUpdate={handleEditUserModalUpdate}
          />
        </div>
      );
};

export default UserProfile;
