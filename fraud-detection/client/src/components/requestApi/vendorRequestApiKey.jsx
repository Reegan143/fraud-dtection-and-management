import React, { useState, useContext } from 'react';
import { Card, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/header/header';
import API from "../utils/axiosInstance";
import AuthContext from '../context/authContext';
import VendorSidebar from '../dashboard/sideBar/vendorSidebar';

const RequestApiKey = () => {
  const [transactionId, setTransactionId] = useState('');
  const [notifications, setNotifications] = useState([]);
  const { token } = useContext(AuthContext);

  // Add Notification
  const addNotification = (message, variant = 'success') => {
    const newNotification = { id: Date.now(), message, variant };
    setNotifications((prev) => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 5000);
  };

  // Handle API Key Request
  const handleRequestApiKey = async () => {
    if (!transactionId.trim()) {
      addNotification('Transaction ID is required!', 'warning');
      return;
    }

    try {
      const response = await API.admin.post('/admin/request-api-key', { transactionId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      addNotification(response.data.message || 'API Key request sent successfully!', 'success');
      setTransactionId('');
    } catch (error) {
      addNotification(error.response?.data?.error || 'Error requesting API Key', 'danger');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header/>
      <VendorSidebar/>

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        {notifications.map((notification) => (
          <Toast key={notification.id} bg={notification.variant} autohide>
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{notification.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <main className="ms-250 pt-5 mt-4">
        <div className="container-fluid">
          <div className="content-area">
            <h1>Request API Key</h1>
            <p>Enter the Transaction ID to request an API key.</p>

            <Card className="shadow-sm p-4 mt-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleRequestApiKey} className="mt-2">
                  Send Request
                </Button>
              </Form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestApiKey;
