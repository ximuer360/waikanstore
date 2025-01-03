import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: { password: string }) => {
    // 临时使用硬编码的密码进行测试
    const ADMIN_PASSWORD = 'admin123';
    
    if (values.password === ADMIN_PASSWORD) {
      localStorage.setItem('adminKey', values.password);
      message.success('登录成功');
      navigate('/admin');
    } else {
      message.error('密码错误');
    }
  };

  React.useEffect(() => {
    console.log('Environment variables:', {
      REACT_APP_ADMIN_KEY: process.env.REACT_APP_ADMIN_KEY,
      NODE_ENV: process.env.NODE_ENV
    });
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5' 
    }}>
      <Card title="管理员登录" style={{ width: 300 }}>
        <Form
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入管理员密码' }]}
          >
            <Input.Password placeholder="请输入管理员密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 