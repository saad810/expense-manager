import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call for signup
    setTimeout(() => {
      message.success('Signup successful');
      setLoading(false);
      // Redirect to login or other actions
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Title level={2} style={styles.title}>Sign Up</Title>
        <Form
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
                  return Promise.reject('The two passwords do not match!');
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

          <Form.Item name="terms" valuePropName="checked" rules={[{ required: true, message: 'You must accept the terms and conditions!' }]}>
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
              loading={loading}
              style={styles.submitButton}
            >
              Sign Up
            </Button>
          </Form.Item>

          <Form.Item style={styles.loginPrompt}>
            Already have an account? <a href="#">Log in</a>
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
