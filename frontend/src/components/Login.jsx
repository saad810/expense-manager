import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Simulate authentication (replace with actual API call)
      const { username, password } = values;

      // Simple mock check (replace with real authentication logic)
      if (username === 'user' && password === 'password') {
        // Set isAuthenticated in localStorage after successful login
        localStorage.setItem('isAuthenticated', 'true');

        // Update local state for authentication
        setIsAuthenticated(true);

        // If login is successful, redirect to the dashboard
        message.success('Login successful!');
        navigate('/');
      } else {
        // If credentials are incorrect
        message.error('Invalid credentials!');
      }
    } catch (error) {
      message.error('Login failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Title level={2} style={styles.title}>Login</Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          style={styles.form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="#">Forgot password?</a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={styles.submitButton}
            >
              Log In
            </Button>
          </Form.Item>

          <Form.Item style={styles.signUpPrompt}>
            Don't have an account? <a href="#">Sign up</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    width: '400px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    maxWidth: '100%',
  },
  input: {
    height: '40px',
  },
  forgotPassword: {
    float: 'right',
    fontSize: '12px',
  },
  submitButton: {
    marginTop: '20px',
    borderRadius: '5px',
  },
  signUpPrompt: {
    textAlign: 'center',
    marginTop: '15px',
  },
};

export default Login;
