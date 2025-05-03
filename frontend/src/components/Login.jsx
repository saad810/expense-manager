import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import userApi from '../api/user';
import { useAuth } from '../context/auth';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { login } = useAuth(); // Get user data from context
  const { mutateAsync: loginAcc, isLoading: loading } = useMutation({
    mutationFn: userApi.loginUser,
    onSuccess: (data) => {
      message.success(data.message || 'Login successful!');
      console.log('Login successful:', data);
      if (data.token) {
        // localStorage.setItem('authToken', data.token);
        login(data?.token); // Call the login function from context
        // setIsAuthenticated(true);
        navigate('/app'); // Redirect to the app page after successful login
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Login failed';
      console.log('Login error:', error);
      message.error(message);
    },
  });

  const handleLogin = async (values) => {
    const payload = {
      email: values.username,
      password: values.password,
    };

    try {
      await loginAcc(payload);

    } catch (error) {
      console.error('Login error:', error);
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
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
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
            Don't have an account? <Link to="/signup">Sign up</Link>
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
