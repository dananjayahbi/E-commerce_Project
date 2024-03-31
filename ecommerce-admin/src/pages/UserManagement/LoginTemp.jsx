import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const LoginTemp = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/users/login', values);
        console.log('Login successful', response.data);
        // Add your logic for handling successful login here
        message.success('Login successful');
      } catch (error) {
        console.error('Login failed', error);
        // Add your logic for handling login failure here
        message.error('Login failed. Please check your credentials.');
      }
    },
  });

  return (
    <div style={{ width: 300, margin: 'auto', marginTop: 100 }}>
      <Form onFinish={formik.handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          validateStatus={formik.errors.email ? 'error' : ''}
          help={formik.errors.email}
        >
          <Input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          validateStatus={formik.errors.password ? 'error' : ''}
          help={formik.errors.password}
        >
          <Input.Password
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginTemp;
