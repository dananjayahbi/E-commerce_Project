import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Divider, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import AddBrandModal from "./AddBrandModal";
import EditBrandModal from "./EditBrandModal";
import DeleteBrandModal from "./DeleteBrandModal";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [addBrandModalVisible, setAddBrandModalVisible] = useState(false);
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

  const handleEdit = (brandId) => {
    setEditModalVisible(true);
    setSelectedBrandId(brandId);
  };

  const handleDelete = (brandId) => {
    setDeleteModalVisible(true);
    setSelectedBrandId(brandId);
  };

  const handleAddNew = () => {
    setAddBrandModalVisible(true);
  };

  const handleAddBrandModalCancel = () => {
    setAddBrandModalVisible(false);
  };

  const handleAddBrandModalAdd = () => {
    setAddBrandModalVisible(false);
    fetchData();
  };

  const handleEditBrandModalCancel = () => {
    setEditModalVisible(false);
    setSelectedBrandId(null);
  };

  const handleEditBrandModalUpdate = () => {
    setEditModalVisible(false);
    setSelectedBrandId(null);
    fetchData();
  };

  const handleDeleteBrandModalCancel = () => {
    setDeleteModalVisible(false);
    setSelectedBrandId(null);
  };

  const handleDeleteBrandModalDelete = () => {
    setDeleteModalVisible(false);
    setSelectedBrandId(null);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/brands/getBrands"
      );
      setBrands(response.data);
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
      title: "",
      dataIndex: "imageURL",
      key: "imageURL",
      ellipsis: true,
      width: 70, // Adjust the width as per your requirement
      render: (brandImage) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={brandImage ? brandImage : error_img}
            alt="Avatar"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      ),
    },
    {
      title: "Brand Name",
      dataIndex: "brandName",
      key: "brandName",
      width: 250,
      sorter: (a, b) => a.brandName.localeCompare(b.brandName),
      sortOrder: sortedInfo.columnKey === "brandName" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("brandName"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 700,
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
          Brands Management
        </span>
        <Divider />
        <div>
          <Button
            type="primary"
            onClick={handleAddNew}
            style={{ marginBottom: 16 }}
          >
            Add New Brand
          </Button>

          <Table
            columns={columns}
            dataSource={brands}
            loading={loading}
            scroll={{ x: 1000 }}
            onChange={handleChange}
          />

          {/* Add New Brand Modal */}
          <AddBrandModal
            visible={addBrandModalVisible}
            onCancel={handleAddBrandModalCancel}
            onAdd={handleAddBrandModalAdd}
          />

          {/* Edit Brand Modal */}
          <EditBrandModal
            brandId={selectedBrandId}
            visible={editModalVisible}
            onCancel={handleEditBrandModalCancel}
            onUpdate={handleEditBrandModalUpdate}
          />

          {/* Delete Brand Modal */}
          <DeleteBrandModal
            brandId={selectedBrandId}
            visible={deleteModalVisible}
            onCancel={handleDeleteBrandModalCancel}
            onDelete={handleDeleteBrandModalDelete}
          />
        </div>
      </div>
      )}
    </>
  );
};

export default Brands;
