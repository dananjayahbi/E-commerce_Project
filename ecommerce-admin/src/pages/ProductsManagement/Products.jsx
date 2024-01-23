import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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

  const handleEdit = (unitId) => {
    setEditModalVisible(true);
    setSelectedProductId(unitId);
  };

  const handleDelete = (unitId) => {
    setDeleteModalVisible(true);
    setSelectedProductId(unitId);
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
      const response = await axios.get("http://localhost:5000/products/getProducts");
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
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      sortOrder: sortedInfo.columnKey === "productName" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("productName"),
    },
    {
      title: "Product Code",
      dataIndex: "productCode",
      key: "productCode",
      sorter: (a, b) => a.productCode.localeCompare(b.productCode),
      sortOrder: sortedInfo.columnKey === "productCode" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("productCode"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      sortOrder: sortedInfo.columnKey === "category" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      sortOrder: sortedInfo.columnKey === "brand" && sortedInfo.order,
      ellipsis: true,
      ...getColumnSearchProps("brand"),
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      render: (sellingPrice) => `Rs. ${parseFloat(sellingPrice).toFixed(2)}`, //change the format of selling price to Rs. 0.00
    },
    {
      title: "Stocks Available",
      dataIndex: "stocks",
      key: "stocks",
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
      <span style={{fontSize:"24px", fontWeight:"600"}}>Products Management</span>
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
          unitId={selectedProductId}
          visible={editModalVisible}
          onCancel={handleEditProductModalCancel}
          onUpdate={handleEditProductModalUpdate}
        />

        {/* Delete Unit Modal */}
        <DeleteProductModal
          unitId={selectedProductId}
          visible={deleteModalVisible}
          onCancel={handleDeleteProductModalCancel}
          onDelete={handleDeleteProductModalDelete}
        />
      </div>
    </div>
  );
}

export default Products