import React, { useState, useEffect } from "react";
import { Modal, Card, Row, Col } from "antd";
import axios from "axios";
import avatar_default from "../../images/avatar_default.png"

const ViewUserModal = ({ userId, visible, onCancel }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Authentication token not found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/users/getUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Modal
      title="User Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={650} // Increase the modal width
    >
      {userData && (
        <Card>
          <Row gutter={16}>
            <Col span={12} style={{display: "flex", justifyContent: 'center', alignItems:"center"}}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={userData.profileImage ? userData.profileImage : avatar_default}
                  alt="Invalid Profile Picture URl"
                  style={{
                    borderRadius: "50%",
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                  }}
                />
              </div>
            </Col>
            <Col span={12}>
              <p>
                <strong>Full Name :</strong> {userData.fullName}
              </p>
              <p>
                <strong>Username :</strong> {userData.username}
              </p>
              <p>
                <strong>Email :</strong> {userData.email}
              </p>
              <p>
                <strong>Role :</strong> {userData.role}
              </p>
              <p>
                <strong>Phone Number :</strong> {userData.phoneNumber}
              </p>
              <p>
                <strong>NIC :</strong> {userData.NIC}
              </p>
              <p>
                <strong>IsActive? :</strong> {userData.isActive ? "True" : "False"}
              </p>
              <p>
                <strong>Registered Date :</strong>{" "}
                {formatDate(userData.registeredDate)}
              </p>
              <p>
                <strong>Last Logged In Date :</strong>{" "}
                {formatDate(userData.lastLogin)}
              </p>
            </Col>
          </Row>
        </Card>
      )}
    </Modal>
  );
};

export default ViewUserModal;
