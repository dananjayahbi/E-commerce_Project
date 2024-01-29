import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Divider, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
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

  const handleEdit = (categoryId) => {
    setEditModalVisible(true);
    setSelectedCategoryId(categoryId);
  };

  const handleDelete = (categoryId) => {
    setDeleteModalVisible(true);
    setSelectedCategoryId(categoryId);
  };

  const handleAddNew = () => {
    setAddCategoryModalVisible(true);
  };

  const handleAddCategoryModalCancel = () => {
    setAddCategoryModalVisible(false);
  };

  const handleAddCategoryModalAdd = () => {
    setAddCategoryModalVisible(false);
    fetchData();
  };

  const handleEditCategoryModalCancel = () => {
    setEditModalVisible(false);
    setSelectedCategoryId(null);
  };

  const handleEditCategoryModalUpdate = () => {
    setEditModalVisible(false);
    setSelectedCategoryId(null);
    fetchData();
  };

  const handleDeleteCategoryModalCancel = () => {
    setDeleteModalVisible(false);
    setSelectedCategoryId(null);
  };

  const handleDeleteCategoryModalDelete = () => {
    setDeleteModalVisible(false);
    setSelectedCategoryId(null);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/categories/getCategories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 200,
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      sortOrder: sortedInfo.columnKey === "categoryName" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("categoryName"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 500,
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
            Categories Management
          </span>
          <Divider />
          <div>
            <Button
              type="primary"
              onClick={handleAddNew}
              style={{ marginBottom: 16 }}
            >
              Add New Category
            </Button>

            <Table
              columns={columns}
              dataSource={categories}
              loading={loading}
              scroll={{ x: 1000 }}
              onChange={handleChange}
            />

            {/* Add New Category Modal */}
            <AddCategoryModal
              visible={addCategoryModalVisible}
              onCancel={handleAddCategoryModalCancel}
              onAdd={handleAddCategoryModalAdd}
            />

            {/* Edit Category Modal */}
            <EditCategoryModal
              categoryId={selectedCategoryId}
              visible={editModalVisible}
              onCancel={handleEditCategoryModalCancel}
              onUpdate={handleEditCategoryModalUpdate}
            />

            {/* Delete Category Modal */}
            <DeleteCategoryModal
              categoryId={selectedCategoryId}
              visible={deleteModalVisible}
              onCancel={handleDeleteCategoryModalCancel}
              onDelete={handleDeleteCategoryModalDelete}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Category;
