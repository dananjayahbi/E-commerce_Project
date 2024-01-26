import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';

const DeleteProductModal = ({ productId, visible, onCancel, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/products/deleteProduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.status === 200) {
        console.log("Product deleted successfully");
        onDelete();
      } else {
        console.error("Unexpected server response:", response);
      }
    } catch (error) {
      console.error("Error deleting product:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Product"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button danger key="delete" loading={loading} onClick={handleDelete}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this product?</p>
    </Modal>
  );
}

export default DeleteProductModal