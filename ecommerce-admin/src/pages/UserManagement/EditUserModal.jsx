import React from 'react';
import { Modal, Button } from 'antd';

const EditUserModal = ({ visible, onCancel }) => {
  return (
    <Modal
      title="Edit User"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary">
          Update
        </Button>,
      ]}
    >

    </Modal>
  );
}

export default EditUserModal