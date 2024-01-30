import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Divider, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import AddUnitModal from "./AddUnitModal";
import EditUnitModal from "./EditUnitModal";
import DeleteUnitModal from "./DeleteUnitModal";

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [addUnitModalVisible, setAddUnitModalVisible] = useState(false);
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
    setSelectedUnitId(unitId);
  };

  const handleDelete = (unitId) => {
    setDeleteModalVisible(true);
    setSelectedUnitId(unitId);
  };

  const handleAddNew = () => {
    setAddUnitModalVisible(true);
  };

  const handleAddUnitModalCancel = () => {
    setAddUnitModalVisible(false);
  };

  const handleAddUnitModalAdd = () => {
    setAddUnitModalVisible(false);
    fetchData();
  };

  const handleEditUnitModalCancel = () => {
    setEditModalVisible(false);
    setSelectedUnitId(null);
  };

  const handleEditUnitModalUpdate = () => {
    setEditModalVisible(false);
    setSelectedUnitId(null);
    fetchData();
  };

  const handleDeleteUnitModalCancel = () => {
    setDeleteModalVisible(false);
    setSelectedUnitId(null);
  };

  const handleDeleteUnitModalDelete = () => {
    setDeleteModalVisible(false);
    setSelectedUnitId(null);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/units/getUnits");
      setUnits(response.data);
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
      title: "Unit",
      dataIndex: "unitName",
      key: "unitName",
      sorter: (a, b) => a.unitName.localeCompare(b.unitName),
      sortOrder: sortedInfo.columnKey === "unitName" && sortedInfo.order,
      ellipsis: true,
      width: 200,
      ...getColumnSearchProps("unitName"),
    },
    {
      title: "Short Name",
      dataIndex: "shortName",
      key: "shortName",
      sorter: (a, b) => a.shortName.localeCompare(b.shortName),
      sortOrder: sortedInfo.columnKey === "shortName" && sortedInfo.order,
      ellipsis: true,
      width: 200,
      ...getColumnSearchProps("shortName"),
    },
    {
      title: "Base Unit",
      dataIndex: "baseUnit",
      key: "baseUnit",
      width: 200,
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
      width: 200,
    },
    {
      title: "Operation Value",
      dataIndex: "operationValue",
      key: "operationValue",
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
            Units Management
          </span>
          <Divider />
          <div>
            <Button
              type="primary"
              onClick={handleAddNew}
              style={{ marginBottom: 16 }}
            >
              Add New Unit
            </Button>

            <Table
              columns={columns}
              dataSource={units}
              loading={loading}
              onChange={handleChange}
              scroll={{ x: 1000 }}
            />

            {/* Add New Unit Modal */}
            <AddUnitModal
              visible={addUnitModalVisible}
              onCancel={handleAddUnitModalCancel}
              onAdd={handleAddUnitModalAdd}
            />

            {/* Edit Unit Modal */}
            <EditUnitModal
              unitId={selectedUnitId}
              visible={editModalVisible}
              onCancel={handleEditUnitModalCancel}
              onUpdate={handleEditUnitModalUpdate}
            />

            {/* Delete Unit Modal */}
            <DeleteUnitModal
              unitId={selectedUnitId}
              visible={deleteModalVisible}
              onCancel={handleDeleteUnitModalCancel}
              onDelete={handleDeleteUnitModalDelete}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Units;
