import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Row,
  Col,
  Typography,
  Space,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import AutomatedSavingsSuggestions from "../components/common/AutomatedSavingsSuggestions";
import { useMutation, useQuery } from '@tanstack/react-query';
import userApi from '../api/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["get-user"],
    queryFn: () => userApi.getStatus(),
    onError: () => {
      console.error("Error fetching user data:", error);
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      message.success('User updated successfully');
      toast.success('User updated successfully');
    },
    onError: (error) => {
      console.error(error);
      message.error('Failed to update user');
      toast.error('Failed to update user');
    },
  });
  const navigate = useNavigate();
  const { logout } = useAuth

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      message.success('User account deleted successfully');
      toast.success('User account deleted successfully');
      // logout(); // Call logout function to clear user session
      navigate('/login'); // Redirect to the home page after deletion
      // Redirect to a different page after deletion (e.g., home page)
    },
    onError: (error) => {
      console.error(error);
      message.error('Failed to delete user account');
      toast.error('Failed to delete user account');
    },
  });

  const [form] = useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user, form]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      await updateUser(values);
      await refetch(); // Refetch user data after update
      setUser(values);
      message.success('Profile updated successfully');
      form.resetFields(); // Reset form fields after successful update
      setIsEditing(false);
    } catch {
      message.error('Please check the fields again');
    }
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    deleteUser(); // Call delete user API
    setIsDeleteModalVisible(false); // Close the modal after deletion
  };

  return (
    <>
      <Card
        title="User Profile"
        extra={
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={handleEditClick}
              type="primary"
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={showDeleteModal}
              type="primary" // Use "primary" type to override the default color
              style={{
                marginLeft: 8,
                backgroundColor: 'red', // Background color
                color: 'white', // Text color
                borderColor: 'red', // Border color
                fontWeight: 'bold', // Optional: Make the text bolder
              }}
            >
              Delete My Account
            </Button>

          </Space>
        }
        style={{
          width: '100%',
          marginTop: 32,
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Row gutter={32}>
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Avatar
              size={100}
              style={{
                backgroundColor: '#1890ff',
                color: '#fff',
                fontSize: 36,
                marginBottom: 16,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Title level={4}>{user?.name}</Title>
            <Text type="secondary">{user?.occupation}</Text>
          </Col>
          <Col xs={24} md={18}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text type="secondary">Email</Text>
                <Paragraph>{user?.email}</Paragraph>
              </Col>
              <Col span={12}>
                <Text type="secondary">Phone</Text>
                <Paragraph>{user?.phoneNumber}</Paragraph>
              </Col>
              <Col span={12}>
                <Text type="secondary">Country</Text>
                <Paragraph>{user?.country}</Paragraph>
              </Col>

              <Col span={24}>
                <Text type="secondary">About</Text>
                <Paragraph>{user?.about}</Paragraph>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Modal
        title="Edit Profile"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={handleSave}
        okText="Save"
        cancelText="Cancel"
        centered
        destroyOnClose
        width={600}
        bodyStyle={{ paddingTop: 10 }}
      >
        <Form form={form} layout="vertical" name="editProfile">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
              >
                <Input placeholder="john@example.com" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phoneNumber"
              >
                <Input placeholder="+1 234 567 890" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
              >
                <Input placeholder="United States" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Occupation"
                name="occupation"
              >
                <Input placeholder="Software Engineer" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="About"
                name="about"
              >
                <Input.TextArea rows={4} placeholder="Tell us about yourself" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Confirmation Modal for Deleting Account */}
      <Modal
        title="Delete Account"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        cancelText="Cancel"
        centered
        width={400}
      >
        <Typography.Paragraph>
          Are you sure you want to delete your account? This action is irreversible, and you will lose all your data.
        </Typography.Paragraph>
      </Modal>
    </>
  );
};

export default Profile;
