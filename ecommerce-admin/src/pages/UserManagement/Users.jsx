import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import ViewUserModal from "./ViewUserModal";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (sorter) => {
    setSortedInfo(sorter);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? <span>{text}</span> : text,
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleView = (userId) => {
    setViewModalVisible(true);
    setSelectedUserId(userId);
  };

  const handleEdit = (userId) => {
    setEditModalVisible(true);
    setSelectedUserId(userId);
  };

  const handleDelete = (userId) => {
    setDeleteModalVisible(true);
    setSelectedUserId(userId);
  };

  const handleAddNew = () => {
    setAddUserModalVisible(true);
  };

  const handleAddUserModalCancel = () => {
    setAddUserModalVisible(false);
  };

  const handleAddUserModalAdd = () => {
    setAddUserModalVisible(false);
    fetchData();
  };

  const handleViewUserModalCancel = () => {
    setViewModalVisible(false);
    setSelectedUserId(null);
  };

  const handleViewUserModalUpdate = () => {
    setViewModalVisible(false);
    setSelectedUserId(null);
    fetchData();
  };

  const handleEditUserModalCancel = () => {
    setEditModalVisible(false);
    setSelectedUserId(null);
  };

  const handleEditUserModalUpdate = () => {
    setEditModalVisible(false);
    setSelectedUserId(null);
    fetchData();
  };

  const handleDeleteUserModalCancel = () => {
    setDeleteModalVisible(false);
    setSelectedUserId(null);
  };

  const handleDeleteUserModalDelete = () => {
    setDeleteModalVisible(false);
    setSelectedUserId(null);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/users/getAllUsers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortOrder: sortedInfo.columnKey === "username" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <span
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 870 ? "column" : "row",
          }}
        >
          <Button
            onClick={() => handleView(record._id)}
            style={{
              marginRight: "5px",
              marginBottom: window.innerWidth < 870 ? "5px" : "0px",
            }}
          >
            View
          </Button>
          <Button
            type="primary"
            onClick={() => handleEdit(record._id)}
            style={{
              marginRight: "5px",
              marginBottom: window.innerWidth < 870 ? "5px" : "0px",
            }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <span style={{fontSize:"24px", fontWeight:"600"}}>Users Management</span>
      <Divider />
      <div>
        <Button
          type="primary"
          onClick={handleAddNew}
          style={{ marginBottom: 16 }}
        >
          Add New User
        </Button>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          onChange={handleChange}
        />

        {/* View User Modal */}
        <ViewUserModal
          userId={selectedUserId}
          visible={viewModalVisible}
          onCancel={handleViewUserModalCancel}
          onUpdate={handleViewUserModalUpdate}
        />

        {/* Add New User Modal */}
        <AddUserModal
          visible={addUserModalVisible}
          onCancel={handleAddUserModalCancel}
          onAdd={handleAddUserModalAdd}
        />

        {/* Edit User Modal */}
        <EditUserModal
          userId={selectedUserId}
          visible={editModalVisible}
          onCancel={handleEditUserModalCancel}
          onUpdate={handleEditUserModalUpdate}
        />

        {/* Delete User Modal */}
        <DeleteUserModal
          userId={selectedUserId}
          visible={deleteModalVisible}
          onCancel={handleDeleteUserModalCancel}
          onDelete={handleDeleteUserModalDelete}
        />
      </div>
    </div>
  );
}

export default Users