import React from 'react';
import { Modal, Button } from 'antd';

const AddUserModal = ({ visible, onCancel }) => {

  return (
    <Modal
      title="Add User"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="add" type="primary">
          Add
        </Button>,
      ]}
    >

    </Modal>
  );
}

export default AddUserModal