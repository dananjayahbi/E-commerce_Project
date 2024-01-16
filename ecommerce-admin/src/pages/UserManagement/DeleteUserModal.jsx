import React from 'react';
import { Modal, Button } from 'antd';

const DeleteUserModal = ({ visible, onCancel }) => {
  return (
    <Modal
      title="Delete User"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="delete" type="primary">
          Delete
        </Button>,
      ]}
    >

    </Modal>
  );
}

export default DeleteUserModal