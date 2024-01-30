import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Divider, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
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

  const handleEdit = (productId) => {
    setEditModalVisible(true);
    setSelectedProductId(productId);
  };

  const handleDelete = (productId) => {
    setDeleteModalVisible(true);
    setSelectedProductId(productId);
  };

  const handleAddNew = () => {
    setAddProductModalVisible(true);
  };

  const handleAddProductModalCancel = () => {
    setAddProductModalVisible(false);
  };

  const handleAddProductModalAdd = () => {
    setAddProductModalVisible(false);
    fetchData();
  };

  const handleEditProductModalCancel = () => {
    setEditModalVisible(false);
    setSelectedProductId(null);
  };

  const handleEditProductModalUpdate = () => {
    setEditModalVisible(false);
    setSelectedProductId(null);
    fetchData();
  };

  const handleDeleteProductModalCancel = () => {
    setDeleteModalVisible(false);
    setSelectedProductId(null);
  };

  const handleDeleteProductModalDelete = () => {
    setDeleteModalVisible(false);
    setSelectedProductId(null);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/products/getProducts"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching units:", error);
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
      dataIndex: "featureImage",
      key: "featureImage",
      ellipsis: true,
      width: 70, // Adjust the width as per your requirement
      render: (featureImage) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={featureImage ? featureImage : error_img}
            alt="Avatar"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: 200,
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      sortOrder: sortedInfo.columnKey === "productName" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("productName"),
    },
    {
      title: "Product Code",
      dataIndex: "productCode",
      key: "productCode",
      width: 200,
      sorter: (a, b) => a.productCode.localeCompare(b.productCode),
      sortOrder: sortedInfo.columnKey === "productCode" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("productCode"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 200,
      sorter: (a, b) => a.category.localeCompare(b.category),
      sortOrder: sortedInfo.columnKey === "category" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 200,
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      sortOrder: sortedInfo.columnKey === "brand" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("brand"),
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      width: 200,
      render: (sellingPrice) => `Rs. ${parseFloat(sellingPrice).toFixed(2)}`, //change the format of selling price to Rs. 0.00
    },
    {
      title: "Stocks Available",
      dataIndex: "stocks",
      key: "stocks",
      width: 200,
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
            Products Management
          </span>
          <Divider />
          <div>
            <Button
              type="primary"
              onClick={handleAddNew}
              style={{ marginBottom: 16 }}
            >
              Add New Product
            </Button>

            <Table
              columns={columns}
              dataSource={products}
              loading={loading}
              scroll={{ x: 1000 }}
              onChange={handleChange}
            />

            {/* Add New Unit Modal */}
            <AddProductModal
              visible={addProductModalVisible}
              onCancel={handleAddProductModalCancel}
              onAdd={handleAddProductModalAdd}
            />

            {/* Edit Unit Modal */}
            <EditProductModal
              productId={selectedProductId}
              visible={editModalVisible}
              onCancel={handleEditProductModalCancel}
              onUpdate={handleEditProductModalUpdate}
            />

            {/* Delete Unit Modal */}
            <DeleteProductModal
              productId={selectedProductId}
              visible={deleteModalVisible}
              onCancel={handleDeleteProductModalCancel}
              onDelete={handleDeleteProductModalDelete}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
