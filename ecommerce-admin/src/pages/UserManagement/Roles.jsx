import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import axios from 'axios';
import AddRoleModal from './AddRoleModal';
import EditRoleModal from './EditRoleModal';
import DeleteRoleModal from './DeleteRoleModal'; // Import the DeleteRoleModal component

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // State for AddRoleModal
  const [addRoleModalVisible, setAddRoleModalVisible] = useState(false);

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record._id)}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)}>Delete</Button>
        </span>
      ),
    },
  ];

  const handleEdit = (roleId) => {
    // Open edit modal and set the selected role ID
    setEditModalVisible(true);
    setSelectedRoleId(roleId);
  };

  const handleDelete = (roleId) => {
    // Open delete modal and set the selected role ID
    setDeleteModalVisible(true);
    setSelectedRoleId(roleId);
  };

  const handleAddNew = () => {
    // Open AddRoleModal
    setAddRoleModalVisible(true);
  };

  const handleAddRoleModalCancel = () => {
    // Close AddRoleModal
    setAddRoleModalVisible(false);
  };

  const handleAddRoleModalAdd = () => {
    // Handle logic after adding a new role (refresh data, close modal, etc.)
    setAddRoleModalVisible(false);
    fetchData(); // Refresh data
  };

  const handleEditRoleModalCancel = () => {
    // Close EditRoleModal and reset selected role ID
    setEditModalVisible(false);
    setSelectedRoleId(null);
  };

  const handleEditRoleModalUpdate = () => {
    // Handle logic after updating a role (refresh data, close modal, etc.)
    setEditModalVisible(false);
    setSelectedRoleId(null);
    fetchData(); // Refresh data
  };

  const handleDeleteRoleModalCancel = () => {
    // Close DeleteRoleModal and reset selected role ID
    setDeleteModalVisible(false);
    setSelectedRoleId(null);
  };

  const handleDeleteRoleModalDelete = () => {
    // Handle logic after deleting a role (refresh data, close modal, etc.)
    setDeleteModalVisible(false);
    setSelectedRoleId(null);
    fetchData(); // Refresh data
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/roles/getRoles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={handleAddNew} style={{ marginBottom: 16 }}>
        Add New Role
      </Button>

      <Table columns={columns} dataSource={roles} loading={loading} />

      {/* Add New Role Modal */}
      <AddRoleModal
        visible={addRoleModalVisible}
        onCancel={handleAddRoleModalCancel}
        onAdd={handleAddRoleModalAdd}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        roleId={selectedRoleId}
        visible={editModalVisible}
        onCancel={handleEditRoleModalCancel}
        onUpdate={handleEditRoleModalUpdate}
      />

      {/* Delete Role Modal */}
      <DeleteRoleModal
        roleId={selectedRoleId}
        visible={deleteModalVisible}
        onCancel={handleDeleteRoleModalCancel}
        onDelete={handleDeleteRoleModalDelete}
      />
    </div>
  );
};

export default Roles;
