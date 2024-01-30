import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Divider, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [addRoleModalVisible, setAddRoleModalVisible] = useState(false);
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

  const handleEdit = (roleId) => {
    setEditModalVisible(true);
    setSelectedRoleId(roleId);
  };

  const handleDelete = (roleId) => {
    setDeleteModalVisible(true);
    setSelectedRoleId(roleId);
  };

  const handleAddNew = () => {
    setAddRoleModalVisible(true);
  };

  const handleAddRoleModalCancel = () => {
    setAddRoleModalVisible(false);
  };

  const handleAddRoleModalAdd = () => {
    setAddRoleModalVisible(false);
    fetchData();
  };

  const handleEditRoleModalCancel = () => {
    setEditModalVisible(false);
    setSelectedRoleId(null);
  };

  const handleEditRoleModalUpdate = () => {
    setEditModalVisible(false);
    setSelectedRoleId(null);
    fetchData();
  };

  const handleDeleteRoleModalCancel = () => {
    setDeleteModalVisible(false);
    setSelectedRoleId(null);
  };

  const handleDeleteRoleModalDelete = () => {
    setDeleteModalVisible(false);
    setSelectedRoleId(null);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/roles/getRoles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",
      width: 200,
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
      sortOrder: sortedInfo.columnKey === "roleName" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("roleName"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 500,
      ellipsis: true,
      // No search functionality for the "Description" field
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (record) => (
        <span
          style={{
            display: "flex",
          }}
        >
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
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <div>
          <span style={{ fontSize: "24px", fontWeight: "600" }}>
            Roles Management
          </span>
          <Divider />
          <div>
            <Button
              type="primary"
              onClick={handleAddNew}
              style={{ marginBottom: 16 }}
            >
              Add New Role
            </Button>

            <Table
              columns={columns}
              dataSource={roles}
              loading={loading}
              scroll={{ x: 1000 }}
              onChange={handleChange}
            />

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
        </div>
      )}
    </>
  );
};

export default Roles;
