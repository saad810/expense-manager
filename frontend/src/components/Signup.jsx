import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/user';
import toast from 'react-hot-toast';

const { Title } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { mutateAsync: signup, isLoading } = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: (data) => {
      toast.success(data.message || 'User created successfully!');
      console.log('User created:', data);

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      form.resetFields();
      navigate('/app');
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || 'Failed to create user';
      toast.error(message);
      console.error('Signup error:', error);
    },
  });

  const onFinish = async (values) => {
    const payload = {
      email: values.email,
      password: values.password,
      confirmPassword: values.confirm,
    };
    await signup(payload);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Title level={2} style={styles.title}>Sign Up</Title>
        <Form
          form={form}
          name="signup"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={styles.form}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
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

          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('You must accept the terms and conditions!')
                      ),
              },
            ]}
          >
            <Checkbox>
              I agree to the <a href="#">terms and conditions</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
              style={styles.submitButton}
            >
              Sign Up
            </Button>
          </Form.Item>

          <Form.Item style={styles.loginPrompt}>
            Already have an account? <a href="/login">Log in</a>
          </Form.Item>
        </Form>

        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Spin tip="Signing up..." />
          </div>
        )}
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
  submitButton: {
    marginTop: '20px',
    borderRadius: '5px',
  },
  loginPrompt: {
    textAlign: 'center',
    marginTop: '15px',
  },
};

export default Signup;
